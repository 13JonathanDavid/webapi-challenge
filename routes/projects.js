const express = require('express');
const db = require('../data/helpers/projectModel');


function validateBody(arr) {
    return function(req, res, next) {
        try {
            arr.map( (i)=>{
                console.log(i);
                if(!(typeof req.body[i]) || req.body[i] === "")
                    throw "invalid request";
            });
            next();
        }
        catch(e){
            res.status(400).json({errorMessage: e});
        }
    }
}

const router = express.Router();
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
        result = await db.get(req.params.id);
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
        result = await db.remove(req.params.id);
        if(result)
            res.status(202).json({message: `item with id ${req.params.id} deleted`});
        else
            throw "no item to delete";
    }
    catch(e){
        res.status(500).json({errorMessage: e });
    }
});
router.put('/:id', validateBody(["project_id","description","notes"]), async (req, res) => {
    try {
        let obj = {};
        if(req.body.completed) obj.completed = req.body.completed;
        await db.update(req.params.id, {...obj,
            project_id: req.params.project_id,
            description: req.body.description,
            notes: req.body.notes
        });
        res.status(500).json({message: `item with id ${req.params.id} updated`})
    }
    catch(e){
        res.status(500).json({errorMessage: e });
    }
});
module.exports = router;