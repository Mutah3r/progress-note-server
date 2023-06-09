const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const moment = require('moment');
require('dotenv').config();


// middle-wares
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@porfolioprojects.vkb3mrm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // DB Collections
        const tasksCollection = client.db("ProgressNote").collection("tasks");

        app.get('/', (req, res) => {
            res.send('ProgressNote Server is in progress....')
        });

        app.get('/allTasks', async (req, res) => {
            const userEmail = req.query.email;
            const query = { email: userEmail };

            try {
                const userTasks = await tasksCollection.find(query).toArray();
                res.send(userTasks);
            }
            catch(error){
                // res.send(error);
            }
        })


        app.post('/addTask', async (req, res) => {
            const task = req.body;
            const date = moment().format('MMMM Do YYYY');
            const time = moment().format('h:mm a');

            task.taskAddedDate = date;
            task.taskAddedTime = time;

            try {
                const result = await tasksCollection.insertOne(task);
                res.send(result);
            }
            catch (error) {
                res.send(error);
            }
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`ProgressNote app listening on port ${port}`)
})