import { Request, Response } from "express"
import { db } from "../../db/index.js";
import { ConsoleLogWriter, eq } from "drizzle-orm";
import { orderItemsTable, ordersTable } from "../../db/schemas/orders.js";

/*
Responsable for the CRUD operations of the Orders.
*/

export async function listOrders(req: Request, res: Response){
    // return a list of the orders.
    try {
        const orders = await db.select().from(ordersTable);
        console.log("all orders fetched: ", orders);
        res.status(200).json(orders)
    } catch (error) {
        console.log("Error fetching all orders: ", error);
        res.status(500).send({ error: error});
    }
}

export async function getOrderById(req: Request, res: Response){
    // get order items by orderId
    try {
        console.log("request params => ", req.params);
        const orderId = parseInt(req.params.id);
        const orderItems = await db.select().from(ordersTable).leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId)).where(eq(ordersTable.id, orderId));
        console.log("order items for orderId: ", orderId, " => ", orderItems);
                
        // destruct the orderItems to show only the order object with a list of item objects.
        // TODO: first need to check if order has items before assuming there is one
	const orderWithItems = { ...orderItems[0].orders, items: orderItems.map((item) => item.order_items)};
        console.log("OrderWithItems: => ", orderWithItems);

        res.status(200).json(orderWithItems);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error});
    }
}

export async function updateOrder(req: Request, res: Response){
    // update the order status only
    try {
        if (!req.params.id) {
            res.status(400).send({message: "Missing OrderId param"});
        }
        const reqData = req.filteredParams;
        console.log("reqData received: ", reqData);
        const orderId = parseInt(req.params.id);
        const [result] = await db.update(ordersTable).set(reqData).where(eq(ordersTable.id, orderId)).returning()

        console.log("update result: ", result)
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error});
    }
}

export async function createOrder(req: Request, res: Response){
    try {
        // destruct the req data
        const {order, items} = req.filteredParams;
        const orderData = {userId: Number(req.userId)}

        // first insert the order and get back the orderId back
        const [ createdOrder ] = await db.insert(ordersTable).values(orderData).returning();
        
        // use the orderId to insert the orderItems after creating the orderItems object.
        const orderItems = items.map((item: any) => ({
            ...item,
            orderId: createdOrder.id,
        }));
        console.log("orderItems to be inserted: ", orderItems);

        // create the OrderItems
        const createdOrderItems = await db.insert(orderItemsTable).values(orderItems).returning();
        console.log("CreatedOrderItems => ", createdOrderItems);
        res.status(201).json({ ...createdOrder, items: createdOrderItems});
    } catch (error) {
        console.log("error: ", error);
        res.status(500).send({error: error});

    }
}
