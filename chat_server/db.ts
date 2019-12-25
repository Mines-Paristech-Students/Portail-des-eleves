import { Client } from "pg";

const client = new Client({
  host: "db",
  user: "docker",
  password: "docker",
  database: "portail_message",
  port: 5432,
});

let create_schema_query = `
    CREATE TABLE IF NOT EXISTS messages (
        user_id VARCHAR(50) NOT NULL,
        posted_on TIMESTAMP NOT NULL,
        message TEXT NOT NULL
    )
    CREATE INDEX posted_on ON messages DESC
`;

let setup = async () => {
  await client.connect();
  await client
    .query(create_schema_query)
    .then(res => {
      console.info("✅ create schema sucessfully");
    })
    .catch(err => {
      console.error("❌ failed to create schema, ", err);
    });
};

export async function add(user_id: string, message: string) {
  await setup;
  return client.query(
    "INSERT INTO messages (user_id, message, posted_on) VALUES ($1, $2, NOW())",
    [user_id, message]
  );
}

export async function get(from: Date, limit: number) {
  await setup;
  return client.query(
    "SELECT * FROM messages WHERE posted_on <= $1 ORDER BY posted_on DESC LIMIT $2",
    [from, limit]
  );
}
