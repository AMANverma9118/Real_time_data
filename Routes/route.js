const express=require("express");

const { newInventory, getInventory } = require("../Controller/controller");

const uploadMultiple = require("../Middleware/multer");
const router=express.Router();

router.post("/newInventory",uploadMultiple,newInventory)
router.get("/getInventory",getInventory)

module.exports =router;