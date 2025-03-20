import { Router } from "express";
import { validateData } from "../../middlewares/validators";
import { createUsersSchema, loginUsersSchema, usersTable } from  "../../db/schemas/user";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';

const router = Router();

async function hashPassword(password: String) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(plainPassword: String, hashedPassword: any) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}


router.post('/register', validateData(createUsersSchema), async (req, res) => {
    console.log(req.filteredParams);
    const filteredParams = req.filteredParams;
    const hashedPassword = await hashPassword(filteredParams.password);
    filteredParams.password = hashedPassword;
    try {
        const [result] = await db.insert(usersTable).values(filteredParams).returning();
        res.status(200).send({user: result});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

router.post('/login', validateData(loginUsersSchema), async (req, res) => {
    console.log(req.filteredParams);
    
    const {email, password } = req.filteredParams;

    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        console.log("user found => ", user);
        if (!user) {
            res.status(401).json({error: 'Authentication failed'});
            return;
        }

        const isMatch = await comparePassword(password, user.password);
        console.log("IS PASSWORD MATCH ? ", isMatch);

        if (!isMatch){
            res.status(401).json({error: "Authentication failed"});
            return;
        }

        res.status(200).json({ user });
    } catch (error){
        res.status(500).json({error: error.message});

    }
} )

export default router;