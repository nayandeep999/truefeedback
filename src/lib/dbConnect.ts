import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

export async function dbConnect(): Promise<void> {
  //check if we have a connection to database or if its currently connecting
  if (connection.isConnected) {
    //console.log("Already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL!);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error("Database connection failed", error);

    //gracefully exit in case of a connection error
    process.exit(1);
  }
}
