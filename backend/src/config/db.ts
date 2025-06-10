import { MongoClient, ServerApiVersion } from "mongodb";

const { MONGO_USER, MONGO_PASSWORD, MONGO_CONN_STRING } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD) {
    throw new Error("Mongo DB credentials not detected.");
}
const uri =
    MONGO_CONN_STRING ??
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.wr9zgdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const connectDB = async () => {
    try {
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } catch (err) {
        console.error(err);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
};
connectDB().catch(console.dir);
