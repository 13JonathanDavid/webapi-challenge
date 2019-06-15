const express = require('express');
const db_project = require('../data/helpers/projectModel');
const db = require('../data/helpers/projectModel');

const router = express.Router();
//const validator = require('../utls/validateRoutes');
router.get('/', async (req,res) => {
    try {
       let result = await db.get();
        if(result.length === 0) throw "no projects availible";
        res.status(200).json(result);
    }
    catch(e) {
        await res.status(500).json({errorMessage: e });
    }
});

router.get('/:id', async (req,res) => {
    try {
        result = await db.get();
        if((result || result.length === 0)) throw "project not availible";
        else res.status(200).json(result);
    }
    catch(e) {
        let errorCode = ((e==="post not availible") ? 404 : 500);
        res.status(errorCode).json({errorMessage: e });
    }
});

router.post('/', async (req, res) => {
    try {
        result = await db.insert({
            name: req.body.name,
            description: req.body.description
        });
        res.status(201).json({result});
    } catch(e) {
        res.status(500).json({errorMessage: "Could not create new project."});
    }
});


router.delete('/:id',  async (req, res) => {
    try {
        await db.remove(req.params.id);
        res.status(202).json({message: `item with id ${req.params.id} deleted`})
    }
    catch(e){
        res.status(500).json({errorMessage: e });
    }
});
router.put('/:id',  async (req, res) => {
    try {
        await db.update(req.params.id, req.body);
        res.status(500).json({message: `item with id ${req.params.id} updated`})
    }
    catch(e){
        res.status(500).json({errorMessage: e });
    }
});
module.exports = router;