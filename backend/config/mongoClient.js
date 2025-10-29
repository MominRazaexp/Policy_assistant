import { MongoClient } from "mongodb";

let client;

export async function getMongoClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI, {});
    await client.connect();
  }
  return client;
}

export async function getDB(dbName) {
  const c = await getMongoClient();
  const uri = new URL(process.env.MONGO_URI);
  const defaultDb = uri.pathname?.replace("/", "") || "admin";
  return c.db(dbName || defaultDb);
}