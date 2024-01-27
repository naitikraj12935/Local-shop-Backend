const Product = require('../Models/Product.model');






// Example subscription object (replace with the actual subscription from your users)


const AddProduct=async (req,res,next)=>{
    try{
        console.log(req.body);
         const newProduct=await Product.create(req.body);
         res.status(200).json({
            status:'ok',
            newProduct:newProduct
         })
         next();
    }
    catch(error)
    {
       res.status(400).json({
        status:'fail',
        msg: error.message,

       })
    }
}

const deleteProduct = async (req, res) => {
    try {
        console.log(req.body);
        const deletedProduct = await Product.findByIdAndDelete(req.body._id);

        res.status(200).json({
            status: 'ok',
            msg: 'Product deleted successfully',
            deletedProduct: deletedProduct
        });
    } catch (error) {
        // Send an error response and exit the function
        return res.status(400).json({
            status: 'fail',
            msg: error.message
        });
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId; // Assuming the product ID is passed in the request parameters
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({
                status: 'fail',
                msg: 'Product not found'
            });
        }
        
        
        
        res.status(200).json({
            status: 'ok',
            msg: 'Product updated successfully',
            updatedProduct: updatedProduct
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            msg: error.message
        });
    }
};
const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId; // Assuming the product ID is passed in the request parameters
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: 'fail',
                msg: 'Product not found'
            });
        }

        res.status(200).json({
            status: 'ok',
            product: product
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            msg: error.message
        });
    }
};
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            status: 'ok',
            count: products.length,
            products: products
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            msg: error.message
        });
    }
};


const SearchItem = async (req, res) => {
  try {
    const { keyword } = req.body;
    console.log(keyword);
    console.log(req.body);

    // Search for the keyword in product name, description, and category (case-insensitive)
    const foundProducts = await Product.find({
      $or: [
        { productName: { $regex: keyword, $options: 'i' } }, // Case-insensitive search for product name
        { description: { $regex: keyword, $options: 'i' } }, // Case-insensitive search for description
        { productCategory: { $regex: keyword, $options: 'i' } }, // Case-insensitive search for category
      ],
    });

    res.status(200).json({
      status: 'success',
      data: {
        products: foundProducts,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      msg: error.message,
    });
  }
};

const SearchAll=async (req,res)=>{
        try {
            const Products=await Product.aggregate([
                {
                  $group: {
                    _id: "$productCategory",
                     product_Name:{
                       $push:"$productName"
                     },
                    
                    
                  }
                }
              ])
              res.status(200).json({
                Products
              })
        } catch (error) {
            res.status(500).json({
                status:'server error'
            })
               
            
        }
}

const getProductbyCreator=async (req,res)=>{
    try {
        console.log(req.body)
         const Products=await Product.find({createdBy:req.body._id})

         res.status(200).json({
            Products
         })
    } catch (error) {
        res.status(500).json({
            status:'server error'
        })
    }
}

const NewLunch = async (req, res) => {
    try {
        let newProducts = await Product.find({});

        // Filter products created within the last 7 days
        newProducts = newProducts.filter((item) => (
            (Date.now() - (item?.createdAt || 0)) <= 7 * 24 * 60 * 60 * 1000
        ));

        // Sort products based on creation date in descending order
        newProducts.sort((a, b) => b?.createdAt - a?.createdAt);

        res.status(200).json({
            newProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Server error'
        });
    }
};

const Sale=async (req,res)=>{
    try {
        const SaleData=await Product.aggregate([
            {
              $match: {
                Offer:{
                  $gte:18
                }
              }
            }
          ])
          res.status(200).json({
            SaleData
          })
        
    } catch (error) {
        res.status(500).json({
            msg:'internal server error'
        })
    }
}




module.exports={AddProduct,getAllProducts,getProductById,updateProduct,deleteProduct,SearchItem,SearchAll,getProductbyCreator,NewLunch,Sale};