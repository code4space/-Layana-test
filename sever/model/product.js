const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    date_input: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    uploaded_by: {
        type: String,
        ref: 'Users'
    }
});

const Products = mongoose.model('Products', schema);
module.exports = Products