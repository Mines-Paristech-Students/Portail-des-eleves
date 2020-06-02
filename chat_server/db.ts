import { Pool } from "pg";

import { Message } from "./message";

// All infos for pools are passed while starting the container
const pool = new Pool();

// Queries
const create_schema_query = `
  CREATE TABLE IF NOT EXISTS messages (
    username VARCHAR(50) NOT NULL,
    posted_on TIMESTAMP,
    message TEXT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS index ON messages(posted_on DESC);
`;

const add_query =
  "INSERT INTO messages (username, message, posted_on) VALUES ($1, $2, $3)";

const get_query =
  "SELECT * FROM messages WHERE posted_on <= $1 ORDER BY posted_on DESC LIMIT $2";

// If a client raises an error
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Creating the table if it does not exists
pool
  .query(create_schema_query)
  .then(() => {
    console.info("Database schema available ✅");
  })
  .catch((err) => {
    console.error("Failed to create schema ❌", err);
  });

// Query functions
const add = async function add(message: Message) {
  await pool.query(add_query, [
    message.username,
    message.message,
    message.posted_on,
  ]);
};

let get = async function get(from: Date, limit: number) {
  // Converting date to UTC for mysql
  let sql_from = new Date(from).toISOString();
  return await pool.query(get_query, [sql_from, limit]);
};

// Functions to export for index.js
module.exports = {
  add: add,
  get: get,
};
