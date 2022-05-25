const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());


//<------------- Database Code Here ---------->

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxp8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        //<------------ Database All Collections ------------->

        const database = client.db("Signal-Air-Radio-Station");
        const stations = database.collection("Stations-Collection");


        //<------------ Database All API ------------->

        // Get All Stations From DB

        app.get('/stations', async (req, res) => {
            const sllStations = await stations.find({}).toArray();
            res.send(sllStations)
        })

        // Create New Station in Database

        app.post('/addStation', async (req, res) => {
            const Name = req.body.Name;
            const Code = req.body.Code;
            const Image = req.body.Image;
            const display = "none";
            const newStation = {
                Name, Code, Image, display
            }
            console.log(newStation);
            const result = await stations.insertOne(newStation);
            res.json(result);
        })

        // Delete An Station

        app.delete('/deleteStation/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { Code: id }
            const remove = await stations.deleteOne(query);
            res.json(remove)
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Signal-Air-Radio-Station-Server')
});


app.listen(port, () => {
    console.log("Running Server Port is", port);
});