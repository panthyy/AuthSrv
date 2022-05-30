const getDb = require("../utils/database");

var users,
  { registerUser, getUser, authenticateUser } = require("../routes/users");

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
beforeAll(async () => {
  database = await getDb();
  await resetdb(database);
});

test("should not allow weak password", async () => {
  const user = {
    email: "test@hotmail.com",
    username: "test",
    password: "test",
    repeatPassword: "test",
    firstName: "test",
    lastName: "test",
    phoneNumber: "test",
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const req = { body: user };
  await registerUser(database)(req, res);
  expect(res.status).toHaveBeenCalledWith(422);
});

test("should register user", async () => {
  const user = {
    email: "test@hotmail.com",
    username: "test",
    password: "Test123!@#",
    repeatPassword: "Test123!@#",
    firstName: "test",
    lastName: "test",
    phoneNumber: "test",
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
  const req = { body: user };
  await registerUser(database)(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
});

test("should authenticate user", async () => {
  const user = {
    email: "test@hotmail.com",
    password: "Test123!@#",
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const req = {
    body: user,
    headers: {
      authorization: "a",
    },
  };
  await authenticateUser(database)(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      token: expect.any(String),
    })
  );
});

test("should get user", async () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const req = { params: { id: 1 } };
  await getUser(database)(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    email: "test@hotmail.com",
    username: "test",
    firstName: "test",
    lastName: "test",
    phoneNumber: "test",
  });
});
