import express from 'express';
import cors from 'cors';
import productRouter from './routes/products/index.js';
import authRouter from './routes/auth/index.js';
import orderRouter from './routes/orders/index.js';
import categoryRouter from './routes/categories/index.js';

const port = 3000
const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use('/products', productRouter);
app.use('/auth', authRouter);
app.use('/orders', orderRouter);
app.use('/categories', categoryRouter);

app.listen(port, () => {
    console.log(`Example listing to port ${port}`)
})
