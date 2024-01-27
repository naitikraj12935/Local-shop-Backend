const mongoose = require('mongoose');
const Product = require('./Product.model'); // Import your Product model

const orderSchema = new mongoose.Schema({
    orderedProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Enter product id']
    },
    orderedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Enter user id']
    },
    orderedQuantity: {
        type: Number,
        required: true
    },
    Payamount: Number,
    mode_of_payment: {
        type: String,
        
        required: true,
    },
    Payment_id: String,
    Order_id: String,
    Signature: String,
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
    try {
        // Check if it's a new order (during creation)
        if (this.isNew) {
            const product = await Product.findById(this.orderedProduct);
            if (!product) {
                throw new Error('Product not found');
            }
            if (this.orderedQuantity > product.stock) {
                throw new Error('Insufficient stock; we will notify you soon on arrival of this product');
            } else if (this.orderedQuantity === 0) {
                throw new Error('Enter a valid quantity');
            }

            this.Payamount = product.Price * this.orderedQuantity;
            product.stock = product.stock - this.orderedQuantity;
            await product.save({ validateBeforeSave: false });
        }

        // Continue with other logic or just call next() if not needed during update
        next();
    } catch (error) {
        next(error);
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
