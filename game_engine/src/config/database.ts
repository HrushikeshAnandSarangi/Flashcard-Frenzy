import { MongoClient, Db, Collection } from 'mongodb';
import { GameResult } from '../models/game.models';
import { configDotenv } from 'dotenv';
configDotenv();
const MONGO_URI = `${process.env.MONGO_URI}`;
const DATABASE_NAME = "flashcard_game";

let db: Db;
let gameResultsCollection: Collection<GameResult>;

export async function connectToDatabase() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DATABASE_NAME);
  gameResultsCollection = db.collection<GameResult>("game_results_nodejs");
  console.log("Successfully connected to the database.");
}

// Helper to handle MongoDB's _id
const fromMongo = (doc: any) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toHexString(), ...rest };
};

export async function saveGameResult(gameResult: Omit<GameResult, 'id'>): Promise<GameResult | null> {
  const result = await gameResultsCollection.insertOne(gameResult as any);
  if (result.insertedId) {
    const newDoc = await gameResultsCollection.findOne({ _id: result.insertedId });
    return fromMongo(newDoc);
  }
  return null;
}

export async function getGameResults(): Promise<GameResult[]> {
  const results = await gameResultsCollection.find().toArray();
  return results.map(fromMongo);
}

export async function getGameResultByRoomId(roomId: string): Promise<GameResult | null> {
  const result = await gameResultsCollection.findOne({ roomId });
  return fromMongo(result);
}