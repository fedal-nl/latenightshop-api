import { Request, Response } from "express"
import { db } from "../../db/index.js";
import { productsTable } from "../../db/schemas/product.js";
import { eq } from "drizzle-orm";

export async function listProducts(req: Request, res: Response) {
    try {
        const products = await db.select().from(productsTable);
        res.json(products);
        console.log(products)
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}


export async function getProduct(req: Request, res: Response) {
    try {
        const product_id = req.params["id"];
        console.log(`product_id => ${product_id}`);
        console.log(req.params)
        const [product] = await db.select().from(productsTable).where(eq(productsTable.id, Number(product_id)))
        if (!product) {
          res.status(404).send({message: "Product not found"});
        } else {
            res.status(200).json(product)
        }
    } catch (error){
        console.log(`error => ${error}`)
        res.status(500)
    }
    
}

export async function createProduct(req: Request, res: Response) {
    console.log("received body => ", req.body)
    console.log(req.filteredParams);
    try {
        const [result] = await db.insert(productsTable).values(req.filteredParams).returning()
        res.status(201).json(result);    
    } catch(error){
        res.status(501).send({"error": error })
    }    
}

export async function updateProduct(req: Request, res: Response) {
    const product_id = req.params.id;
    const updatedFields = req.filteredParams
    console.log(`product_id => ${product_id}`);
    console.log(req.params)
    console.log(updatedFields);
    try {
        const [result] = await db.update(productsTable).set(updatedFields!).where(eq(productsTable.id, Number(product_id))).returning();
        if (result) {
            res.status(200).json(result)
            console.log("updated product result: ", result);
        } else {
            res.status(404).send({message: `Product with ${product_id} is not found`})
        }
    } catch (error) {
            res.status(500).send({error: `${error!}`})
    }
}

export async function deleteProduct(req: Request, res: Response) {
    const product_id = req.params["id"];
    console.log(`product_id => ${product_id}`);
    console.log(req.params)
    try {
        const result = await db.delete(productsTable).where(eq(productsTable.id, Number(product_id)))
        if (result) {
            res.status(204).send({message: `Product ${product_id} is deleted`});
        } else {
            res.status(404).send({message: "Product not found"});        
        }    
    } catch(error) {
        res.status(500).send({message: `ERROR: ${error!}`})
    }

}
