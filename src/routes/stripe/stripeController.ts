import { Request, Response } from 'express';
import Stripe from 'stripe';

const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY; // Replace with your Stripe publishable key
const secretKey = process.env.STRIPE_SECRET_KEY; // Replace with your Stripe secret key
const currency = 'eur'; // You can change this to your desired currency

if (!secretKey) {
    throw new Error('Stripe secret key is not defined in the environment variables');
}
if (!publishableKey) {
    throw new Error('Stripe publishable key is not defined in the environment variables');
}

// create a stripeclient by initializing the Stripe object with the secret key
// The secret key is used to authenticate requests to the Stripe API and perform operations such as creating payment intents, managing customers, etc.
const stripe = new Stripe(secretKey);
const customer = await stripe.customers.create();

const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id }, // Replace with the actual customer ID
    { apiVersion: '2024-09-30.acacia' } // Replace with the desired API version
);

// create a new PaymentIntent for a stripe payment. 
// A PaymentIntent tracks the customer’s payment lifecycle, keeping track of any failed payment attempts
// and ensuring the customer is only charged once. 
// Return the PaymentIntent’s client secret in the response to finish the payment on the client.
export async function createPaymentIntent(req: Request, res: Response) {

    const { amount } = req.body;
    console.log('amount received: ', amount);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customer.id, // Replace with the actual customer ID
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json(
            { 
                clientSecret: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: publishableKey,
                paymentIntent: paymentIntent.id
            }
    );
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        res.status(500).json({ error: 'Failed to create PaymentIntent' });
    }
}



// the front-end requires the publishable key to create a payment method.
// This key is used to create a PaymentMethod object, which represents a payment method that can be used to make payments.
export async function getPublishableKey(req: Request, res: Response) {
    // return the publishable key 
    try {
        res.status(200).json({ publishablekey: publishableKey });
    } catch (error) {
        console.error('Error getting key:', error);
        res.status(500).json({ error: 'Failed to get publishable key' });
    }
}
