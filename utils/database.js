const { Client } = require("pg");
const dynamicUpdate = require("./dynamicUpdate");
require("dotenv").config();

var database = null;

// get all tables

class Database {
  constructor() {
    this.client = null;
  }

  connect = async () => {
    await this.client.connect();
  };
  health = async () => {
    // check if the database is up
    const result = await this.client.query("SELECT 1");
    if (result.rowCount === 1) {
      return true;
    }
    return false;
  };

  getTables = async () => {
    const query = await this.client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
    );
    return query.rows;
  };

  getUserByEmail = async (email) => {
    const res = await this.client.query(
      "SELECT * FROM Account WHERE email = $1",
      [email]
    );
    return res.rows[0];
  };

  getUserById = async (id) => {
    const res = await this.client.query("SELECT * FROM Account WHERE id = $1", [
      id,
    ]);
    return res.rows[0];
  };

  createUser = async ({
    email,
    username,
    password,
    firstName,
    lastName,
    phoneNumber,
  }) => {
    const res = await this.client.query(
      "INSERT INTO Account (email, username, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, username, password, firstName, lastName, phoneNumber]
    );
    return res.rows[0];
  };
  async updateUser({
    id,
    email,
    username,
    password,
    firstName,
    lastName,
    phoneNumber,
  }) {
    const { query, values } = dynamicUpdate(
      "Account",
      arguments,
      "Where id = $1"
    );

    const res = await this.client.query(query, values);

    return res.rows[0];
  }
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
