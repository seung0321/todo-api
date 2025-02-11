import mongose from "mongoose";
import * as dotenv from "dotenv";
import data from "./seedData.js";
import Task from "./task.js";

dotenv.config();
console.log(`Start seed`);
await mongose.connect(process.env.DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data);

await mongose.connection.close();
console.log(`End seed`);
