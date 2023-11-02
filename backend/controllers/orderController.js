
const Order = require("../models/ordersModel");
const Product = require("../models/productModel");

//Create New Order....//

exports.newOrder = async(req,res) =>{

  const { shippingInfo, 
    orderItems  , 
    paymentInfo, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice
    } = req.body;

  const order = await Order.create({
    shippingInfo, 
   orderItems  ,
   paymentInfo,
  itemsPrice,
   taxPrice, 
   shippingPrice, 
   totalPrice,
   paidAt:Date.now(),
   user: req.user._id
  });

  res.status(201).json({
    success: true,
    order,
  });

};

//  Admin--Get Single Order or Order Deatils...

 exports.getSingleOrder = async(req,res) => {

  const order = await Order.findById(req.params.id).populate("user" , "name email");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found with this id",
    });
  }
   res.status(200).json({
    success: true,
    order,
   });

 };

 //Get logged in user Orders...means login users can see Orders details..

 exports.myOrders = async(req,res) => {

    const order = await Order.findById({user:req.user._id});

     res.status(200).json({
      success: true,
      order,
     });
  
   };

   //Get All Orders---See by Admin...

   exports.getAllOrders = async(req,res) => {

    const orders = await Order.find();

    let totalAmount = 0;

      orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

     res.status(200).json({
      success: true,
      totalAmount,
      orders
     });
  
   };


    //Updtae All Order Status---See by Admin...

    exports.updateOrder = async(req,res) => {

        const order = await Order.find(req.params.id);
    
    
        if (order.orderStatus == "Delivered") {
            return res.status(400).json({
              success: false,
              message: "You have already delivered this order",
            });
          }

          order.orderItems.forEach( async (order) => {
             await updateStock(order.Product, order.quantity);
          });

          order.orderStatus = req.body.Status;
          if (order.orderStatus == "Delivered") {
            order.deliveredAt = Date.now();
          }

          
          await order.save( { validateBeforeSave: false })

         res.status(200).json({
          success: true,
         });
      
       };

       async function updateStock (id, quantity) {
        const product = await Product.findById(id);

        product.stock = product.stock - quantity;
        
        await product.save({ validateBeforeSave: false });

       };

       // delete Orders -- Admin

       exports.deleteOrder = async(req,res) => {

        const order = await Order.find(req.params.id);

        if (!order) {
            return res.status(404).json({
              success: false,
              message: "Order not found with this id",
            });
          };
    
        await Order.findByIdAndRemove(req.params.id);
    
         res.status(200).json({
          success: true,
         });
      
       };