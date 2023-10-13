const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middle were
app.use(cors());
app.use(express.json());

//username  and password:
//hassan4np
//wTXJ0mxOlvHd8tVv
//main part;
//------------------------------->


const uri = "mongodb+srv://hassan4np:wTXJ0mxOlvHd8tVv@cluster0.uruvxpx.mongodb.net/?retryWrites=true&w=majority";

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
        const database = client.db("usersDB");
        const UserCollection = database.collection("users");

        app.get('/users', async(req, res) => {
            const cursor = UserCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const user = await UserCollection.findOne(query);
            res.send(user)
        })
        app.post('/users', async(req, res) => {
            const user = req.body;
            console.log(user)
            const result = await UserCollection.insertOne(user);
            res.send(result)
        });
        app.put('/users/:id', async(req, res) => {
            const id = req.params.id;
            const updateuser = req.body;
            console.log(updateuser, id);
            const filter = {
                _id: new ObjectId(id)
            };
            const options = { upsert: true };
            const newUpdateuser = {
                $set: {
                    name: updateuser.name,
                    email: updateuser.email
                }
            }
            const result = await UserCollection.updateOne(filter, newUpdateuser, options);
            res.send(result)

        })
        app.delete('/users/:id', async(req, res) => {
            const id = req.params.id;
            console.log('this isdelete ', id);
            const query = {
                _id: new ObjectId(id)
            }
            const result = await UserCollection.deleteOne(query);
            res.send(result)
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




app.get('/', (req, res) => {
    res.send("we are good devoloper");
});
// app.get('/users', (req, res) => {
//     res.send("we are good devoloper 0000000000000000000000000000000000000");
// });


app.listen(port, () => {
    console.log(` this is port name ${port}`)
})