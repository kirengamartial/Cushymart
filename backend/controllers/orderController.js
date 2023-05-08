import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    // console.log(order)
    order.isPaid = true
    order.paidAt = Date.now()
    console.log(req.body)
    order.paymentResult = {
  
      status: req.body.status,
      message: req.body.message,
      data: {
        id: req.body.data.id,
        tx_ref: req.body.data.tx_ref,
        flw_ref: req.body.data.flw_ref,
        device_fingerprint: req.body.data.device_fingerprint,
        amount:req.body.data.amount,
        currency: req.body.data.currency,
        charged_amount: req.body.data.charged_amount,
        app_fee: req.body.data.app_fee,
        merchant_fee: req.body.data.merchant_fee,
        processor_response: req.body.data.processor_response,
        auth_model: req.body.data.auth_model,
        ip: req.body.data.ip,
        narration: req.body.data.narration,
        status: req.body.data.status,
        payment_type: req.body.data.payment_type,
        created_at: req.body.data.created_at,
        acount_id: req.body.data.acount_id,
        meta:{
          __CheckoutInitAddress: req.body.data.meta.__CheckoutInitAddress
        },
        amount_settled: req.body.data.amount_settled,
        customer:{
          id: req.body.data.customer.id,
          name:req.body.data.customer.name,
          phone_number: req.body.data.customer.phone_number,
          email: req.body.data.customer.email,
          created_at: req.body.data.customer.created_at,

        }
      }
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)  
    
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})
// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
