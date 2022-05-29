const { Client } = require("pg");
require("dotenv").config();

var database = null;

// get all tables
const getTables = async () => {
  const query = await this.client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
  );
  return query.rows;
};

function Database() {
  this.getTables = getTables;
  this.client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  this.connect = async () => {
    await this.client.connect();
  };
}

const getDb = async () => {
  if (!database) {
    database = new Database();
    await database.connect();
  }
  return database;
};

module.exports = getDb;
