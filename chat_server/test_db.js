const express = require('express')
const { Client } = require('pg')

const client = new Client()

client.connect()

client.query('DROP TABLE messages');

client.query(`CREATE TABLE IF NOT EXISTS messages (
  user_id VARCHAR(50) NOT NULL,
  posted_on TIMESTAMP NOT NULL,
  message TEXT NOT NULL
) ;
CREATE INDEX IF NOT EXISTS index ON messages(posted_on DESC)`, (err, res) => {
  if (err) {
    console.log(err);
  }
  console.log("done") // Hello World!
  client.end()
})