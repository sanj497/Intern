import Order from '../model/orderModel.js';
import Product from '../model/product.js';
import axios from 'axios';

export const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in order' });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty < 1)
        return res.status(400).json({ message: 'Invalid quantity' });

      // .lean() returns the raw MongoDB document — bypasses Mongoose schema filtering
      // so we get BOTH ProductName and productName regardless of what's in the schema
      const product = await Product.findById(item.productId).lean();
      if (!product)
        return res.status(404).json({ message: `Product not found: ${item.productId}` });

      console.log('[ORDER] Raw product keys:', Object.keys(product));

      const productName = product.ProductName || product.productName || 'Unknown';
      const price       = Number(product.Price  || product.price  || 0);
      const stock       = Number(product.Stock  || product.stock  || 0);
      const thumbnail   = product.Thumbnail || product.thumbnail || '';

      console.log(`[ORDER] ${productName} — stock: ${stock}, qty: ${qty}, price: ${price}`);

      if (stock < qty)
        return res.status(400).json({ message: `Not enough stock for "${productName}". Only ${stock} left.` });

      totalAmount += price * qty;
      orderItems.push({ product: product._id, productName, price, quantity: qty, thumbnail });

      // Decrement whichever field actually exists
      const stockField = product.Stock !== undefined ? 'Stock' : 'stock';
      await Product.findByIdAndUpdate(product._id, { $inc: { [stockField]: -qty } });
    }

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'unpaid'
    });
    await order.save();

    // Clear cart silently
    try {
      const { default: Cart } = await import('../model/cartModel.js');
      await Cart.findOneAndUpdate({ user: userId }, { items: [] });
    } catch (_) {}

    if (paymentMethod === 'khalti') {
      const khaltiRes = await axios.post(
        'https://a.khalti.com/api/v2/epayment/initiate/',
        {
          return_url: `http://localhost:5173/order-success?orderId=${order._id}`,
          website_url: 'http://localhost:5173/',
          amount: totalAmount * 100,
          purchase_order_id: order._id.toString(),
          purchase_order_name: `granny_SB Order #${order._id.toString().slice(-6)}`
        },
        { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, 'Content-Type': 'application/json' } }
      );
      order.pidx = khaltiRes.data.pidx;
      await order.save();
      return res.status(201).json({ message: 'Order placed', order, paymentUrl: khaltiRes.data.payment_url });
    }

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('PLACE ORDER ERROR:', err.message);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const verifyOrderPayment = async (req, res) => {
  const { pidx, orderId } = req.body;
  try {
    const khaltiRes = await axios.post(
      'https://a.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` } }
    );
    if (khaltiRes.data.status === 'Completed') {
      const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid', status: 'confirmed' }, { new: true });
      return res.json({ message: 'Payment verified', order });
    }
    res.status(400).json({ message: 'Payment not completed' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username email').sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { Stock: item.quantity } });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};