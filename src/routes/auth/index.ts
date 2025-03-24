import { Router } from "express";
import { validateData } from "../../middlewares/validators";
import { createUsersSchema, loginUsersSchema, usersTable } from  "../../db/schemas/user";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const secret = process.env.JWT_SECRET!


function generateJWToken(userId: number, userRole: string, expires: string='1d') {
    // responsable for generating a JWToken. Takes the userId and userRole with an optional param for
    // the expiration of the token. default is 300 seconds.

    const token = jwt.sign(
        {
            userId: userId, 
            role: userRole
        },
        secret, 
        { expiresIn: expires } as jwt.SignOptions
    )
    return token;
}

// registration router uses the createdUserSchema validator
router.post('/register', validateData(createUsersSchema), async (req, res) => {
    // destruct the filteredParams to take the passowrd and hash it
    const {password, ...params} = req.filteredParams;
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // add it to the params
    params.password = hashedPassword;
    try {
        //insert into the db
        const [user] = await db.insert(usersTable).values(params).returning();
        // if the user is successfully created, do not return the hashed password
        const {password, ...createdUser} = user;
        // return 200 and the created user without the passowrd
        // generate a token and return it in the response
        const token = generateJWToken(user.id, user.role);
        res.status(201).json({token, createdUser});
    } catch (error) {
        res.status(500).send({message: error});
    }
})


router.post('/login', validateData(loginUsersSchema), async (req, res) => {
    // take only the email and password
    const { email, password } = req.filteredParams;
    // console.log(`email and password received: ${email} - ${password}`);
    // check first if the user exists base on the email. if it does, check the passowrd.
    // this why we don't need to search by the email and the hashedpassword.
    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        console.log("user found => ", user);
        if (!user) {
            res.status(401).json({error: 'Authentication failed'});
            return;
        }

        // use the bcrypt compare function to check the password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("IS PASSWORD MATCH ? ", isMatch);
        if (!isMatch){
            res.status(401).json({error: "Authentication failed"});
            return;
        }

        delete (user as any).password;
        // return 200 and the created user without the passowrd
        // USER LOGGED IN, GENERATE A TOKEN
        const token = generateJWToken(user.id, user.role);
        console.log(`New toke ${token}`);

        res.status(200).json({ token, user });
        
        

    } catch (error){
        res.status(500).json({error: error});

    }
} )

export default router;