import express from 'express';
import fs from 'fs';
const app = express();

import petData from './../pets.json' assert {type: 'json'};

app.use(express.json());

//get
app.get('/pets', (req, res) => {
    res.send(petData);
});
//get at index
app.get('/pets/:input', (req, res) => {
    let petInput = req.params.input;
    if (petData[petInput] === undefined) {
        res.status(404).send('Aint Real')
    } else {
        console.log(petData[petInput]);
        res.status(201).send('Pet: ', petData[petInput]);
    }
})

//post
app.post('/pets', (req, res) => {
    let newPet = req.body;
    petData.push(newPet);
    if (newPet.age && newPet.name && newPet.kind && typeof newPet.age === 'number') {
        fs.writeFile('./../pets.json', JSON.stringify(petData), (err) => {
            if (err) {
                throw err;
            } else {
                console.log(newPet);
                res.status(201).send('Added');
            }
        })
    } else {
        req.status(400).send('Incorrect Formatting');
    }
});

//patch
app.patch('/pets/:input', (req, res) => {  
    let petInput = parseInt(req.params.input);
    if (petInput >= 0 && petInput < petData.length) {
        for(let keys in req.body) {
            petData[petInput][keys] = req.body[keys]
        }
        console.log(petData[petInput]);
        res.status(201).send("added");
    } else {
        req.status(404).send('Aint Real')
    }
});

//delete
app.delete('/pets/:input', (req, res) => {
    let petInput = parseInt(req.params.input);
    if (petInput !== undefined) {
        petData.splice(petInput, 1);
        console.log(petData);
        res.status(200).send("Gonso");
    } else {
        res.status(404).send("Not Real");
    }
});

app.listen(8000, () => {
    console.log(`Server listening on 8000`)
});