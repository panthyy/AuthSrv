const { Client } = require("pg");
require("dotenv").config();

var database = null;

// get all tables

function Database() {
  this.client = null;
  this.connect = async () => {
    await this.client.connect();
  };

  this.health = async () => {
    // check if the database is up
    const result = await this.client.query("SELECT 1");
    if (result.rowCount === 1) {
      return true;
    }
    return false;
  };

  this.getTables = async () => {
    const query = await database.client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
    );
    return query.rows;
  };
}

const getDb = async () => {
  if (!database) {
    database = new Database();
    database.client = new Client({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    });
    await database.connect();
  }
  return database;
};

module.exports = getDb;
