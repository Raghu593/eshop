import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//@desc create new Orders
//route POST /api/orders
//@access Private
const addOrderItems = asyncHandler(async(req,res)=>{
        const {orderItems,shippingAddress,paymentMethod,itemsPrice,shippingPrice,taxPrice,totalPrice}=req.body
        console.log("body",req.body)
        if(orderItems && orderItems.length===0){
            res.status(400)
            throw new Error('No Order Items')
            return
        }
        else{
            const order=new Order({
                orderItems,shippingAddress,paymentMethod,itemsPrice,shippingPrice,taxPrice,totalPrice,user:req.user._id
            })
            const createOrder=await order.save()
            res.status(201).json(createOrder)
        }
})

//@desc get Order By ID
//route GET /api/orders/:id
//@access Private

const getOrderById=asyncHandler(async(req,res)=>{
    console.log("order",req.body)
      const order=await Order.findById(req.params.id).populate("user", 'name email')
    //   const order=await Order.findById(req.params.id)
      if(order){
        res.json(order)
      }
      else
      {
          res.status(404)
          throw new Error('Order not found');
      }
})


//@desc update Order To Paid
//route GET /api/orders/:id/pay
//@access Private

const updateOrderToPaid=asyncHandler(async(req,res)=>{
    const order=await Order.findById(req.params.id)
    if(order){
      order.isPaid=true
      order.paidAt=Date.now()

      order.paymentResult={
        id:req.body.id,
        status:req.body.status,
        update_time:req.body.update_time,
        email_address:req.body.payer.email_address

      } //order.paymentresult is gonna come from paypal response replace and chnage according to razorpay
      const updatedOrder=await order.save()
      response.json(updatedOrder)
    }
    else
    {
        res.status(404)
        throw new Error('Order not found');
    }
})


//@desc update Order To Delivered
//route GET /api/orders/:id/deliver
//@access Private/Admin

const updateOrderToDelivered=asyncHandler(async(req,res)=>{
    const order=await Order.findById(req.params.id)
    console.log("oldorderdata",order)
    if(order){
      order.isDelivered=true
      order.deliveredAt=Date.now()

      //order.paymentresult is gonna come from paypal response replace and chnage according to razorpay
      const updatedOrder=await order.save()
      console.log("updatedorderdata",updatedOrder)
      res.json(updatedOrder)
    }
    else
    {
        res.status(404)
        throw new Error('Order not found');
    }
})

//@desc get Logged in User Orders
//route GET /api/orders/myorders
//@access Private

const getMyOrders=asyncHandler(async(req,res)=>{
    const orders=await Order.find({user: req.user._id})
    res.json(orders)
})


//@desc get All Orders
//route GET /api/orders
//@access Admin

const getAllOrders=asyncHandler(async(req,res)=>{
  const orders=await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

export {addOrderItems,getOrderById,updateOrderToPaid,getMyOrders,getAllOrders,updateOrderToDelivered}