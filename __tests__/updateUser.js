const getDb = require("../utils/database");
const { updateUser } = require("../routes/users");

var database = null;

const resetdb = async (db) => {
  const res = await database.client.query(`
    DELETE FROM Account;
    `);
  // reset serial
  const res2 = await database.client.query(`
    ALTER SEQUENCE Account_id_seq RESTART WITH 1;
    `);
};
const createUser = async (db) => {
  const res = await db.client.query(`
    INSERT INTO Account (
        email, 
        username, 
        password, 
        first_name, 
        last_name, 
        phone_number) 
        VALUES (
          'test@hotmail.com',
          'JohnSmith',
          'Test123!@#',
          'John',
          'Smith',
          '1234567890'
          );
    `);
};
beforeAll(async () => {
  database = await getDb();
  await resetdb(database);
  await createUser(database);
});

afterEach(async () => {
  // clear all tables
  await resetdb(database);
  await createUser(database);
});

test("should update user", async () => {
  const req = {
    body: {
      id: 1,
      email: "Changed@hotmail.com",
      username: "Changed",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  await updateUser(database)(req, res);

  expect(res.status).toHaveBeenCalledWith(201);

  const response = await database.client.query(`
    SELECT * FROM Account WHERE id = 1;
    `);

  expect(response.rows[0].email).toBe("Changed@hotmail.com");
  expect(response.rows[0].username).toBe("Changed");
});
