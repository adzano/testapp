const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000; // Define Port here

// Load dummy JSON file
const jsonData = JSON.parse(fs.readFileSync('datasample.json', 'utf8'));

// Middleware to parse JSON bodies
app.use(express.json());

// Base Endpoint return (GET)
app.get('/', (req, res) => {
    res.send('App started successfully! Access from /order, /inquiry, /payment to continue' );
});

// Endpoint for creating an order (POST)
app.post('/order', (req, res) => {
    // Assuming the request body contains JSON data
    const orderData = req.body;

    // Validate the order data
    if (!orderData || !orderData.id || !orderData.name || !orderData.quantity) {
        return res.status(400).json({ status: '400', response: 'bad request', message: 'Invalid input!, check your input' });
    }

    // Check if the ID is "1" and the payload matches the exact structure
    if (orderData.id === '1' && orderData.name === 'Product' && orderData.quantity === '1') {
        return res.status(201).json({ status: '201', response: 'created', message: 'Order created', data: orderData });
    }

    // Check if the ID is "1" but the payload has additional fields or different values for name and quantity
    if (orderData.id === '1') {
        return res.json({ status: '200', response: 'success', message: 'Order modified', data: orderData });
    }

    // For any other ID, return an error
    return res.status(404).json({ status: '404', response: 'DATA_NOT_FOUND', message: 'Invalid order data, check your id input' });
});

// Endpoint for inquiry (GET)
app.get('/inquiry/:id?', (req, res) => {

    // Simulating id input
    const id = req.params.id || req.query.id || null;

    // Dummy data conditional
    let responseData;
    if (id === null) {
        responseData = [
            { id: '1', name: 'Product 1', price: 10.99 },
            { id: '2', name: 'Product 2', price: 20.99 },
            { id: '3', name: 'Product 3', price: 30.99 },
            { id: '4', name: 'Product 4', price: 40.99 },
            { id: '5', name: 'Product 5', price: 50.99 },
        ];
    } else if (id === '1') {
        responseData = { id: '1', name: 'Product 1', price: 10.99 };
    } else if (id === '2') {
        responseData = { id: '2', name: 'Product 2', price: 20.99 };
    } else if (id === '3') {
        responseData = { id: '3', name: 'Product 3', price: 30.99 };
    } else if (id === '4') {
        responseData = { id: '4', name: 'Product 4', price: 40.99 };
    } else if (id === '5') {
        responseData = { id: '5', name: 'Product 5', price: 50.99 };
    } else {
        return res.status(404).json({ status: '404', response: 'DATA_NOT_FOUND', message: 'Data not found on this server' });
    }

    // Dummy response
    res.json({ status: '200', response: 'success', message: 'Get Inquiry successful', data: responseData });
});

// Endpoint for payment (POST)
app.post('/payment', (req, res) => {
    // Assuming the request body contains JSON data
    const paymentData = req.body;

    // Validate the payment data
    const requiredFields = ['product_id', 'name', 'quantity', 'account_no', 'payment_status'];
    const extraFields = Object.keys(paymentData).filter(key => !requiredFields.includes(key));
    if (extraFields.length > 0 || requiredFields.some(key => !(key in paymentData))) {
        return res.status(400).json({ status: '400', response: 'INVALID_DATA', message: 'Invalid payment data, please check your input' });
    }

    // Check if the product_id is "1" and the payment_status is one of "success", "pending", or "failed"
    if (paymentData.product_id === '1' && ['success', 'pending', 'failed'].includes(paymentData.payment_status)) {
        return res.json({ status: '200', response: 'success', message: 'Payment processed successfully', data: paymentData });
    }

    // If the product_id is not "1", return an error stating that the product is not found
    if (paymentData.product_id !== '1') {
        return res.status(404).json({ status: '404', response: 'PRODUCT_NOT_FOUND', message: 'Product not found' });
    }

    // For any other validation errors, return an error
    return res.status(400).json({ status: '400', response: 'INVALID_DATA', message: 'Invalid payment data, please check your input' });
});

// Endpoint for creating a product (POST)
app.post('/product', (req, res) => {
    // Assuming the request body contains JSON data
    const productData = req.body;

    // Validate the product data
    const requiredFields = ['name', 'description', 'price'];
    if (requiredFields.some(key => !(key in productData))) {
        return res.status(400).json({ status: '400', response: 'INVALID_DATA', message: 'Missing required fields, please check your input' });
    }

    // For now, we'll just return a success message
    return res.json({ status: '200', response: 'success', message: 'Product created successfully', data: productData });
});

// Endpoint for creating a user (POST)
app.post('/user', (req, res) => {
    // Assuming the request body contains JSON data
    const userData = req.body;

    // Validate the user data
    const requiredFields = ['name', 'email', 'password'];
    if (requiredFields.some(key => !(key in userData))) {
        return res.status(400).json({ status: '400', response: 'INVALID_DATA', message: 'Missing required fields, please check your input' });
    }

    // For now, we'll just return a success message
    return res.status(201).json({ status: '201', response: 'created', message: 'User created successfully', data: userData });
});

app.get('/data', (req, res) => {
    res.json(jsonData);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
