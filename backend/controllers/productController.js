
const Product = require("../models/productModel");
const { validate } = require("../models/userModel");
const ApiFeatures = require("../utils/apifeatures");


exports.createProduct = async (req, res, next) => {
     try {

       req.body.user = req.user.id
       const product = await Product.create(req.body);
   
       res.status(201).json({
         success: true,
         product
       });
     } catch (error) {
      
       res.status(500).json({
         success: false,
         message: "Failed to create product",
         error: error.message 
       });
     }
   };
   

//Get ALL Product

exports.getAllProducts =  async(req, res) => {
   
      const resultPerPage = 5;
   const productCount = await Product.countDocuments();

     const apiFeatures =  new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
         const products = await apiFeatures.query;
     res.status(200).json({ message: "run properly",
          success:true,
          products
     })

}

//Get Product Details//
exports.getProductDetails = async(req,res,next)=>{
    
  const product = await Product.findById(req.params.id)

     if (!product) {
          return res.status(500).json({
            success: false,
            message: "Product not found",
          });
        }

        res.status(200).json({
          success: true,
         product,
        });
}


// Update Product -- Admin
exports.updateProduct = async (req, res, next) => {
     try {
       let product = await Product.findById(req.params.id);
   
       if (!product) {
         return res.status(404).json({
           success: false,
           message: "Product not found",
         });
       }
   
       product = await Product.findByIdAndUpdate(
         req.params.id,
         req.body,
         {
           new: true,
           useFindAndModify: false,
         }
       );
   
       res.status(200).json({
         success: true,
         product,
       });
     } catch (error) {
       res.status(500).json({
         success: false,
         message: "Internal server error",
       });
     }
   };


   //Delete Product 

exports.deleteProduct = async (req, res, next) => {
     try {
       const product = await Product.findById(req.params.id);
   
       if (!product) {
         return res.status(404).json({
           success: false,
           message: "Product not found",
         });
       }
   
       await Product.findByIdAndRemove(req.params.id)
   
       res.status(200).json({
         success: true,
         message: "Product Delete Successfully",
       });
     } catch (error) {
          console.log({error});
       res.status(500).json({
         success: false,
         message: "Internal server error",
       });
     }
   };
   

  //Create New Review or Upadte the review...Of any Product


exports.CreateProductReview = async (req, res) => {

  const { rating, comment, productId } = req.body;
  console.log(req.body)
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  console.log(review)

  const product = await Product.findById(req.body.productId);
  console.log("product", product)
  const isReviewed = product?.reviews.find((rev) => rev.user.toString() === req.user._id.toString());


  if (isReviewed) {
    // Update existing review
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      };
    });
  } else {
    // Add new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Calculate the average of ratings
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    isReviewed
  });
};

   //Delete review from Projects....

  exports.deleteProduct= async(req,res) =>{
   const product = await Product.findById(req.query.id);

       
       if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
      const reviews = product.reviews.filter(rev => rev._id)

  } 

  //Get All Reviews of a Product...//
  exports.getAllProductReviews = async(req,res) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,

    });
  }

  //Delete Reviews....//

  exports.deleteReview = async(req,res) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());


    let avg = 0;

    reviews.forEach((rev) => {
    avg += rev.rating;
  });
 const ratings = avg / reviews.length;

 const numofReviews = reviews.length;

  await product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numofReviews,
  },{
    new:true,
    runValidators: true,
    useFindAndModify: false
  }
  );


  res.status(200).json({
    success: true,
  });
};



  
