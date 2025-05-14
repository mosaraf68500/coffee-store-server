const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.COFFEE_USER}:${process.env.COFFEE_PASS}@cluster0.bvkgo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    
    await client.connect();



    const CollectionCoffee=client.db("coffeeDB").collection("coffee");
    app.post("/addcoffee",async(req,res)=>{
        const newCoffee=req.body;
        const result=await CollectionCoffee.insertOne(newCoffee);
        res.send(result);
    })

    app.get("/addcoffee",async(req,res)=>{
        const cursor=CollectionCoffee.find();
        const result=await cursor.toArray();
        res.send(result);
    })







    
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee store server is running");
});

app.listen(port, () => {
  console.log(`Coffe store server is running on port:${port}`);
});
