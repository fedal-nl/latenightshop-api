import express from 'express';
import productRouter from './routes/products/index.js';
import authRouter from './routes/auth/index.js';

const port = 3000
const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json());

app.use('/products', productRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Example listing to port ${port}`)
})
