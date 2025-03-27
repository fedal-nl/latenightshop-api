import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

// this middleware is responsible for validating the header token

const secret = process.env.JWT_SECRET!

interface DecodedToken extends JwtPayload {
    userId: number,
    role: string
}

export function verifyAuthentication(req: Request, res: Response, next: NextFunction) {
    // take the token from the header and verify it. if correct, pass the request, otherwise, return a 401
    const token = req.header('authorization');

    if (!token){
        console.log(`No Token found in header: ${JSON.stringify(req.headers, null, 4)}`);
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    try {
        // verified that the token is valid and using the secret. add the userId and role to the request and continue.
        console.log(`Verifying token ${token} and secret: ${secret}`)
        const decodedToken = jwt.verify(token, secret) as DecodedToken;;
        console.log(`decodedToken => ${JSON.stringify(decodedToken, null, 4)}`)
        req.userId = decodedToken.userId;
        req.role = decodedToken.role;
        next()

    } catch (error) {
        console.log(`Invalid token: ${error}`);
        res.status(401).json({error: 'Invalid token'});
    }
}

export function verifyAuthorization(req: Request, res: Response, next: NextFunction) {
    // this function is responsable for the authorization of the user.
    // It will check if the role of the user matches the authorized path role.
    const token = req.header('authorization');
    const path = req.baseUrl;
    const authorized_roles = {
        '/products': ['user', 'admin'],
        '/orders': ['user', 'admin', 'sales']
    }[path];
    console.log(`path to be accessed: ${path} and authorized_roles: ${authorized_roles}`);

    try {
        // here i'm assuming there is always a token, if there isn't one, then it will fail by the varifyAuthentication
        const decodedToken = jwt.verify(token!, secret) as DecodedToken;
        console.log(`decodedToken => ${JSON.stringify(decodedToken, null, 4)}`)
        if (!authorized_roles!.includes(decodedToken.role)) {
            res.status(403).json({ error: 'Forbidden. You are not allowed to access this API'})
        }
        // if the user is autherized pass the userId and role to the request and continue
        req.userId = decodedToken.userId;
        req.role = decodedToken.role;
        next()
    } catch (error) {
        console.log(`Error authorization: ${error}`);
        res.status(500).json({ error: error})
    }

}