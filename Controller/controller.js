const inventory = require("../Models/model");
const cloudinary = require("../Middleware/cloudinary");

const newInventory = async (req, res) => {
    try {
        const {
            type,
            purchaseDate,
            piecesPurchased,
            costPerPiece,
            expiryDate,
            purpose,
            expenditure,
            review  
        } = req.body;

        const billImage = req.files['billImage'] || []; 

        const validateDate = (dateString) => {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(dateString)) {
                return false;
            }
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
        }

        if (!validateDate(purchaseDate)) {
            return res.status(400).json({ message: "Purchase Date must be in the format YYYY-MM-DD and must be a valid date" });
        }
        if (!validateDate(expiryDate)) {
            return res.status(400).json({ message: "Expiry Date must be in the format YYYY-MM-DD and must be a valid date" });
        }

        if (billImage.length === 0) {
            return res.status(400).json({ message: "At least one bill image is required." });
        }

        const billImageUrls = [];
        for (const file of billImage) {
            try {
                const upload = await cloudinary.uploader.upload(file.path);
                billImageUrls.push(upload.secure_url);
            } catch (error) {
                console.error("Error while uploading the bill image:", error);
                return res.status(400).json({ message: "Error while uploading the bill image", error: error.message });
            }
        }

        if (!purchaseDate || !piecesPurchased || !costPerPiece || !expiryDate || !purpose || !expenditure || !type) {
            return res.status(400).json({ message: "Fill all the required fields" });
        }

        const newInventoryItem = new inventory({
            type,
            purchaseDate,
            piecesPurchased,
            costPerPiece,
            expiryDate,
            purpose,
            expenditure,
            review,
            billImage: billImageUrls
        });

        const registeredInventory = await newInventoryItem.save();

        return res.status(200).json({
            message: "Inventory registered successfully",
            inventory: registeredInventory
        });
    } catch (error) {
        console.error("Error in newInventory function:", error);
        res.status(500).json({ message: "Error while adding a new inventory", error: error.message });
    }
};

const getInventory=async(req,res)=>{
    try{
        const inventoryItems=await inventory.find({})
    return res.status(200).json({message:"Inventory recieved successfully",inventoryItems}) 
    }catch(error){
        console.log("error while recieving the list of inventory", error)

        return res.status(500).json({message:"Error while recievong the Inventories",error:error.message})
    }
   
}

const handlePurchase = async (req, res) => {
    try {
        const { inventoryId, piecesPurchased } = req.body;

        
        if (!inventoryId || !piecesPurchased) {
            return res.status(400).json({ message: "Inventory ID and pieces purchased are required" });
        }

        
        const inventoryItem = await inventory.findById(inventoryId);

        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

       
        if (inventoryItem.piecesPurchased < piecesPurchased) {
            return res.status(400).json({ message: 'Not enough pieces available' });
        }

        
        inventoryItem.piecesPurchased -= piecesPurchased;

    
        await inventoryItem.save();

       
        return res.status(200).json({
            message: 'Purchase successful',
            inventoryId: inventoryItem._id,
            piecesAvailable: inventoryItem.piecesPurchased
        });
    } catch (error) {
        console.error("Error in handlePurchase:", error);
        return res.status(500).json({ message: 'Error while processing the purchase', error: error.message });
    }
};

module.exports = {
    newInventory,
    getInventory,
    handlePurchase
};
