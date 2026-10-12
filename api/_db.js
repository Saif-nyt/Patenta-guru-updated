import { MongoClient } from 'mongodb';

function getMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('MONGODB_URI must be configured in the environment');
  }
  return uri;
}

const DB_NAME = 'patente_bangla';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
};

function getClientPromise() {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(getMongoUri(), options);
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
