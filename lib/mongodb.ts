import mongoose, { type ConnectOptions } from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

// Reuse the connection across hot reloads in development.
const cachedConnection = globalWithMongoose.mongooseCache ??= {
  conn: null,
  promise: null,
};

async function connectToDatabase(): Promise<typeof mongoose> {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const options: ConnectOptions = {
      bufferCommands: false,
    };

    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
      );
    }

    // Create a single connection promise so repeated calls share the same work.
    cachedConnection.promise = mongoose.connect(uri, options);
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (error) {
    cachedConnection.promise = null;
    throw error;
  }

  return cachedConnection.conn;
}

export default connectToDatabase;
