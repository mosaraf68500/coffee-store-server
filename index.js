const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    const CollectionCoffee = client.db("coffeeDB").collection("coffee");
    const CollectionProfile=client.db("coffeeDB").collection("profile");
    app.post("/addcoffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await CollectionCoffee.insertOne(newCoffee);
      res.send(result);
    });

    app.get("/addcoffee", async (req, res) => {
      const cursor = CollectionCoffee.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/addcoffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CollectionCoffee.findOne(query);
      res.send(result);
    });


    // profile


    app.get("/profiles",async(req,res)=>{
      const result=await CollectionProfile.find().toArray();
      res.send(result)
    })

    app.post("/profiles",async(req,res)=>{
      const profile=req.body;
      const result= await CollectionProfile.insertOne(profile);
      res.send(result);
    })


    app.patch("/profiles",async(req,res)=>{
      const {email,lastSignInTime}=req.body;
      console.log(email,lastSignInTime)
      const filter={email:email};
      const userDocs={
        $set:{
          lastSignInTime:lastSignInTime

        }
      }
      const result= await CollectionProfile.updateOne(filter,userDocs);
      res.send(result);
    })




    app.delete("/profiles/:id",async(req,res)=>{
      const  id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await CollectionProfile.deleteOne(query);
      res.send(result);
    })


    app.put("/addcoffee/:id",async(req,res)=>{
        const id=req.params.id;
        const updateCoffee=req.body;
        const filter={_id:new ObjectId(id)};
        const option={upsert:true};
        const updateDocs={
            $set:updateCoffee
        }
        const result=await CollectionCoffee.updateOne(filter,updateDocs,option);
        res.send(result);
    })



    app.delete("/addcoffee/:id",async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await CollectionCoffee.deleteOne(query);
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
