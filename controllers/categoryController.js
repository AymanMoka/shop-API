const Category = require('../models/categoryModel')
const {isValidObjectId} = require("mongoose");
module.exports = {
    async addCategory(req,res){
        const newCategory = {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color
        }
        const invalid =await Category.findOne({$or:[
                {name:req.body.name},
                {icon:req.body.icon},
                {color:req.body.color}
            ]})
        if(invalid){
            return res.status(500).json({message:'Category Already Here'})
        }
        Category.create(newCategory).then(
            (category)=>{
                return res.status(200).json({message:'Category Created', category:category})
            }
        ).catch(err=>{
            return res.status(500).json({err:err.message})
        })
    },
    getAllCategories(req,res){
        Category.find({}).select('name').then(
            (categories)=>{
                return res.status(200).json({categories:categories})
            }
        ).catch(err=>{
            return res.status(500).json({err:err.message})
        })
    },
    getCategoryDetails(req,res){
        const categoryId = req.params.id;
        if(!isValidObjectId(categoryId)){
            return res.status(500).json({message:'Id not valid'})
        }
        Category.findOne({_id:categoryId}).then(
            category=>{
                if(!category){
                    return res.status(500).json({message:'Category not found'})
                }
                return res.status(200).json({category:category})
            }
        ).catch(err=>{
            return res.status(500).json({err:err.message})
        })
    },
    async updateCategory(req,res){
        const invalid =await Category.findOne({$or:[
                {name:req.body.name},
                {icon:req.body.icon},
                {color:req.body.color}
            ]})
        if(invalid){
            return res.status(500).json({message:'Category Already Here'})
        }
        const categoryId = req.params.id;
        if(!isValidObjectId(categoryId)){
            return res.status(500).json({message:'Id not valid'})
        }
        Category.findByIdAndUpdate({_id:categoryId},{
            name:req.body.name,
            color:req.body.color,
            icon:req.body.icon
        },{
            new:true
        }).then(
            (category)=>{
                if(!category){
                    return res.status(500).json({message:'Category not found'})
                }
                return res.status(500).json({category:category})
            }
        ).catch(err=>{
            return res.status(500).json({err:err.message})
        })
    }
}


