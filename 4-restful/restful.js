import express from 'express';
const app = express();

import pg from 'pg';
const { Pool } = pg;
const db = new Pool({
    user: 'kylerlacer',
    database: 'petshop',
    password: '1234'
});
await db.connect();

app.use(express.json());

app.get('/pets', (req, res) => {
    db.query('SELECT * FROM pets;')
    .then((result) => {
        console.log(result.rows);
        res.status(201).send(`PETS: ${JSON.stringify(result.rows)}`);
    })
    .catch((error) => {
        res.status(404).send('Aint no way');
    })
});

// await db.query('UPDATE pets SET age = 12 WHERE name = \'thomas\';');
// let result = await db.query('SELECT * FROM pets WHERE name = \'thomas\';');
// console.log(result);

app.listen(8000, () => {
    console.log(`Server listening on 8000`)
});