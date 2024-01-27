const express=require('express')
const ProductRoute=express.Router();
const {AddProduct,getAllProducts,updateProduct,getProductById,deleteProduct,SearchItem,SearchAll,getProductbyCreator,NewLunch,Sale}=require('../controller/product.controller')
const {VerifybeforDelete}=require('../middleware/ProductVerify')

ProductRoute
.route('/addProduct')
 .post(AddProduct)
 
 ProductRoute
  .route('/all')
  .get(getAllProducts);
 
 ProductRoute
 .route('/product/:productId') 
 .put(updateProduct)
 .get(getProductById)
 

 ProductRoute
  .route('/searchItem')
  .post(SearchItem)

 ProductRoute
 .route('/all/product') 
 .get(SearchAll)  
ProductRoute
.route('/product/Create')
.post(getProductbyCreator)

ProductRoute
.route('/delete/Product')
.post(VerifybeforDelete,deleteProduct)

ProductRoute
.route('/NewLaunch')
.get(NewLunch)
 
ProductRoute
.route('/Sale')
.get(Sale)

 module.exports=ProductRoute;