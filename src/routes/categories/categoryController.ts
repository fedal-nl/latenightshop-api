import { Request, Response } from "express"
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { categoriesTable } from "../../db/schemas/category.js";

/*
Responsable for the CRUD operations of the Categories.
*/

export async function listCategories(req: Request, res: Response){
    // return a list of the categories.
    try {
        const categories = await db.select().from(categoriesTable);
        console.log("all categories fetched: ", categories);
        res.status(200).json(categories)
    } catch (error) {
        console.log("Error fetching all categories: ", error);
        res.status(500).send({ error: error});
    }
}


export async function getCategoryById(req: Request, res: Response){
    // get category by id
    try {
        console.log("request params => ", req.params);
        const categoryId = parseInt(req.params.id);
        const category = await db.select().from(categoriesTable).where(eq(categoriesTable.id, categoryId));
        console.log("category for categoryId: ", categoryId, " => ", category);
        res.status(200).json(category);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error});
    }
}


export async function createCategory(req: Request, res: Response){
    // create a new category
    try {
        const reqData = req.filteredParams;
        console.log("reqData received: ", reqData);
        const [result] = await db.insert(categoriesTable).values(reqData).returning()
        console.log("insert result: ", result)
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error});
    }
}


export async function updateCategory(req: Request, res: Response){
    // update the category
    try {
        if (!req.params.id) {
            res.status(400).send({message: "Missing CategoryId param"});
        }
        const reqData = req.filteredParams;
        // Add the current timestamp and the updatedAt field
        reqData.updated_at = new Date();

        console.log("reqData received: ", reqData);
        const categoryId = parseInt(req.params.id);
        const [result] = await db.update(categoriesTable).set(reqData).where(eq(categoriesTable.id, categoryId)).returning()
        console.log("update result: ", result)
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error});
    }
}


export async function deleteCategory(req: Request, res: Response){
    // delete the category
    try {
        if (!req.params.id) {
            res.status(400).send({message: "Missing CategoryId param"});
        }
        const categoryId = parseInt(req.params.id);
        const [result] = await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId)).returning()
        console.log("delete result: ", result)
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error});
    }
}
