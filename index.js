const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb-connection
//hBlQBGSCipMFLtyK
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w13vx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//const uri = `mongodb+srv://warehouse:hBlQBGSCipMFLtyK@cluster0.w13vx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("mongodb connected");
    const productsCollection = client
      .db("InventoryProducts")
      .collection("Products");

    //get all products
    app.get("/products", async (req, res) => {
      const query = {};
      const findProducts = productsCollection.find(query);
      const products = await findProducts.toArray();
      res.send(products);
    });
    //get specific email
    app.get("/products", async (req, res) => {
      const email = req.query;
      console.log(email);
      const query = { email: email };
      const findProducts = productsCollection.find(query);
      const products = await findProducts.toArray();
      res.send(products);
    });
    //insert data
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log("adding new product", product);
      const result = await productsCollection.insertOne(product);
      res.send({ result: "success" });
      // res.send(result);
    });
    // get single user for update purpose
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    //update quantity
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      console.log(req.body);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          stock: updateProduct.quantity,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(updateDoc);
    });
    //delete product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello node");
});
app.listen(port, () => {
  console.log("Listening to the port", port);
});

// user: warehouse;
// password: yLSnFXjfB63NLAna;
// yLSnFXjfB63NLAna;
