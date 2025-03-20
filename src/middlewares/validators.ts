import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { createProductsSchema } from "../db/schemas/product"
import _ from "lodash";


export function validateData(schema: z.ZodObject<any, any>){
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            // filter the request before passing it to the router
            req.filteredParams = _.pick(req.body, Object.keys(schema.shape))
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessage = error.errors.map((issue: any) => (
                    {
                        message: `${issue.path.join('.')} is ${issue.message}`,
                    }
                ));
                res.status(400).json({ error: 'Invalid data', details: errorMessage});
            } else {
                res.status(500).json({ error: 'Internal Server Error'});
            }
        }
    }
}

export function filteredParams (req: Request, allowdFields: Array<string>) {    
    const params_data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowdFields.includes(key)))
    return params_data
}