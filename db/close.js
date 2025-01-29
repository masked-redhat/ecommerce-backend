import mongoose from "mongoose";
import { db } from "./connect.js";

const closeNoSqlConnection = async () => {
  try {
    await mongoose.connection.close();

    console.log("Closed Mongo Db");
  } catch (err) {
    console.log(err);
    console.log("Failed to close Mongo Db");
  }
};

const closeSqlConnection = async () => {
  try {
    await db.close();

    console.log("Closed Sql Db");
  } catch (err) {
    console.log(err);
    console.log("Failed to close Sql Db");
  }
};

const _close = {
  mongo: closeNoSqlConnection,
  pg: closeSqlConnection,
};

export default _close;
