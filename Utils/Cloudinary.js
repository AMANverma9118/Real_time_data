import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECKRET_KEY
});


const UploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        
        // It will upload the file on clodinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //File has been uploaded successfully
        console.log("File is uploaded successfully on cloudinary",response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) //it will remove the locally saved temporary file if the uploaded operation got failed
        return null;
    }
}


export {UploadOnCloudinary}
