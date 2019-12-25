import { Pool } from "pg";

// All infos for pools are passed while starting the container
const pool = new Pool();

// Queries
const create_schema_query = `CREATE TABLE IF NOT EXISTS messages (
    username VARCHAR(50) NOT NULL,
    posted_on TIMESTAMP NOT NULL,
    message TEXT NOT NULL
  ) ;
  CREATE UNIQUE INDEX IF NOT EXISTS index ON messages(posted_on DESC)`;

const add_query = "INSERT INTO messages (username, message, posted_on) VALUES ($1, $2, NOW())";

const get_query = "SELECT * FROM messages WHERE posted_on <= $1 ORDER BY posted_on DESC LIMIT $2";

// If a client raises an error
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Creating the table if it does not exists
pool.query(create_schema_query)
  .then(res => {
    console.info("✅ create schema sucessfully");
  })
  .catch(err => {
    console.error("❌ failed to create schema, ", err);
  });

// Query functions

// Convert javascript datatime to sql
function twoDigits(d) {
  if(0 <= d && d < 10) return "0" + d.toString();
  if(-10 < d && d < 0) return "-0" + (-1*d).toString();
  return d.toString();
}
var dateToMysql = function(date) {
  // Workaround for TypeError issue https://stackoverflow.com/questions/4929382/javascript-getfullyear-is-not-a-function
  date = new Date(date);
  return date.getUTCFullYear() + "-" 
    + twoDigits(1 + date.getUTCMonth()) + "-" 
    + twoDigits(date.getUTCDate()) + " " 
    + twoDigits(date.getUTCHours()) + ":" + twoDigits(date.getUTCMinutes())
     + ":" + twoDigits(date.getUTCSeconds());
};

var add = async function add(username: string, message: string) {
  await pool.query(add_query, [username, message])
};

var get = async function get(from: Date, limit: number) {
  return await pool.query(get_query, [from, limit])
};

// Functions to export for index.js
module.exports = {
  add: add,
  get: get,
  dateToMysql: dateToMysql
}