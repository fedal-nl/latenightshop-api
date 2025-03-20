import { Router } from "express";
import { validateData } from "../../middlewares/validators";
import { createUsersSchema, loginUsersSchema, usersTable } from  "../../db/schemas/user";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';

const router = Router();

async function comparePassword(plainPassword: String, hashedPassword: any) {
    return await bcrypt.compare(plainPassword, hashedPassword);
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
        res.status(200).send({user: createdUser});
    } catch (error) {
        res.status(500).send({message: error.message});
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

        delete user.password;
        // return 200 and the created user without the passowrd

        res.status(200).json({ user });
    } catch (error){
        res.status(500).json({error: error.message});

    }
} )

export default router;