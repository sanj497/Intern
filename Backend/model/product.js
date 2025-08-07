import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productCode: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema, 'Product');

export default Product;
