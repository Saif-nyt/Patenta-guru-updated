import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI?.trim();
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be configured in the environment');
}

const DB_NAME = 'patente_bangla';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
};

function getClientPromise() {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      global._mongoClientPromise = null;
      throw err;
    });
  }
  return global._mongoClientPromise;
}

export async function getDb() {
  const connectedClient = await getClientPromise();
  return connectedClient.db(DB_NAME);
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}
