const Product = require('../models/Product'); // Import the blueprint we just made.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// This function gets all products.
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // .find() asks MongoDB for everything in that collection.
        res.status(200).json(products); // 200 means "OK". We send the data back as JSON.
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 means "Server Error". We tell the frontend what went wrong.
    }
};


exports.createCheckoutSession = async (req, res) => {
    const { cartItems } = req.body;

    // Convert your cart items into Stripe's "Line Items" format
    const line_items = cartItems.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
                images: [item.image],
            },
            unit_amount: item.price * 100, // Stripe uses cents ($10.00 = 1000)
        },
        quantity: 1,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
        });

        res.json({ id: session.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// This handles the Checkout.
exports.checkout = async (req, res, io) => { // Notice 'io' is passed in so we can send real-time alerts.
    try {
        const { items, total } = req.body; // 'Destructuring': pulling 'items' and 'total' out of the incoming request.
        
        for (const item of items) { // Loop through every item in the buyer's cart.
            const product = await Product.findByIdAndUpdate(
                item._id, // Find the specific product by its unique ID.
                { $inc: { stock: -1 } }, // '$inc' is a MongoDB command to "increment" (or decrement with -1).
                { new: true } // This tells MongoDB to return the UPDATED version of the product.
            );
            
            if (product) {
                // If the update worked, we "shout" (emit) the new stock count to EVERYONE online.
                io.emit('stockUpdate', { id: product._id, newStock: product.stock });
            }
        }
        res.status(200).json({ success: true, message: "Order processed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};