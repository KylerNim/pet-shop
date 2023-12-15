import fs from 'fs';
import express from 'express';
let pets;
const app = express()
const regex = /^\/pets\/([0-9]+)$/

fs.readFile("../pets.json", "utf8", (err, data) => {
    if (err) throw err;
    pets = JSON.parse(data);
})

app.get("/pets", (req, res) => {
    console.log("data: ", pets)
    res.status(200).json(pets)
})

app.get(regex, (req, res) => {
    let index = req.url.match(regex)
    index = Number(index[1]) 
    if (index >= pets.length){
        res.status(404).send("Not Found")
    }
    res.status(200).json(pets[index]);
    console.log(index)
    console.log(pets[index]);
})

app.post("/pets", (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString();
    })
    req.on('end', () => {
        let parsedBody = JSON.parse(body);
        if (parsedBody.age && parsedBody.kind && parsedBody.name && typeof parsedBody.age === 'number') {
            fs.writeFile("../pets.json", JSON.stringify(pets.concat(parsedBody)), (err) => {
                if (err) {
                  throw err;
                } else {
                   res.status(200).send(parsedBody);
                }
            })
        } else {
            res.status(400).send("Bad Request");
        }
    })
})
app.listen("8000", () => {
    console.log("Listening on Port 8000");
})

// curl -X POST -H "Content-Type: application/json" -d '{"age": 300, "kind": "Turtle", "name": "Oscar"}' localhost:8000/pets
// curl -X POST -H "Content-Type: application/json" -d '{"age": 300, "name": "Oscar"}' localhost:8000/pets