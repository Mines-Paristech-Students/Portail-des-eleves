import {Client} from "pg";

const client = new Client({ // TODO: put in config file
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'portail_message',
});
const log = require("log");

let create_schema_query = `
    CREATE TABLE IF NOT EXISTS messages (
        user_id VARCHAR(50) NOT NULL,
        posted_on DATETIME NOT NULL,
        message TEXT NOT NULL
    )
    CREATE INDEX posted_on ON messages DESC
`

await client.connect();
await client.query(create_schema_query)
.then(res => { log.info("✅ create schema sucessfully") })
.catch(err => { log.error("❌ failed to create schema, ", err) })

export function add(user_id: string, message: string) { 
        return client.query(
            "INSERT INTO messages (user_id, message, posted_on) VALUES ($1, $2, NOW())"),
            [user_id, message]
    }

export function get (from: Date, limit: number) {
        return client.query(
            "SELECT * FROM messages WHERE posted_on <= $1 ORDER BY posted_on DESC LIMIT $2",
            [from, limit]
        )
    }
}

