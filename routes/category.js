const express = require("express");
const router = express.Router();

const Category = require('../models/Category'); // Import the model

router.post('/', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({success: true, data:categories});
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send();
        }
        res.send(category);
    } catch (error) {
        res.status(500).send(error);
    }
});

// UPDATE a category by ID
router.patch('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!category) {
            return res.status(404).send();
        }
        res.send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).send();
        }
        res.send(category);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports  = router