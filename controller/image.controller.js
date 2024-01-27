

const cloudinary=require('cloudinary');

const path = require('path');
const fs=require('fs')
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret:process.env.CLOUD_SECRATE_KEY
});

const uploadfile= async (req, res)=>{
     console.log(req.file);
     try{
          if(!req.file)
          {
            res.status(404).json({
                message:'image is not uploaded'
            })
          }
          

        const localPath = `public/images/${req.file.filename}`;

          const response=await cloudinary.v2.uploader.upload(localPath,{resource_type:"auto"})
          if(response)
          {
            fs.unlinkSync(localPath)
          }
          
          res.status(200).json({
            message:'image is uploded',
            data:{
                result:response.url
            }
          })
     }
     catch(error){
      fs.unlinkSync(localPath)
        res.status(404).json({
            message:error
        })
     }
  }
  
module.exports=uploadfile;