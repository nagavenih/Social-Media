const con = require("./db_connect")

async function createTable() {
  let sql = `CREATE TABLE IF NOT EXISTS user (
    UserID INT AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    userName VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (UserID)
  );`

  await con.query(sql);
}

createTable()

// CRUD functions will go here 
//R for READ -- get all users

async function getAllUsers() {
  let sql = `SELECT * FROM user;`
  return await con.query(sql)
}
async function getUserData(user) {
  let sql = `SELECT * FROM user 
    WHERE userName = "${user.userName}" OR Email = "${user.Email}";`
  let p1 = await con.query(sql)
  if (p1.length == 0) throw Error("Username/Email doesn't exist!!")
  return p1
}

async function userExists(userName) {
  let sql = `SELECT * FROM user 
    WHERE userName = "${userName}"
  `
  return await con.query(sql)
}

async function emailExists(Email) {
  let sql = `SELECT * FROM user 
    WHERE Email = "${Email}"
  `
  return await con.query(sql)
}

async function register(user) {
  let cUser = await userExists(user.userName)
  if (cUser.length > 0) throw Error("Username is taken! &#128577")

  let email = await emailExists(user.Email)
  if (email.length > 0) throw Error("Account with this Email is already registered! &#128577")

  let sql = `
    INSERT INTO user(firstName,lastName,userName,Email,password)
    VALUES("${user.firstName}","${user.lastName}","${user.userName}", "${user.Email}", "${user.password}")
  `
  await con.query(sql)
  const u = await userExists(user.userName)
  return u[0]
}

// READ in CRUD
async function login(user) {
  let currentUser = await userExists(user.userName)
  if (!currentUser[0]) throw Error("Username does not exist! &#128577")
  if (user.password !== currentUser[0].password) throw Error("Password does not match! &#128577")

  return currentUser[0]
}

// UPDATE in CRUD
async function editUsername(user) {
  let sql = `
    UPDATE user SET
    userName = "${user.userName}"
    WHERE UserID = ${user.UserID}
  `
  await con.query(sql)

  let updatedUser = await userExists(user.userName)
  return updatedUser[0]
}

async function editPassword(user) {
  let updatedUser = await userExists(user.userName)
  if (updatedUser.length > 0) {
    let sql = `
    UPDATE user SET
    password  = "${user.password}"
    WHERE userName = "${user.userName}";
  `
    await con.query(sql)
    return updatedUser[0]
  }
  else {
    throw Error(`User doesn't Exist.!!`)
  }
}

// DELETE in CRUD
async function deleteAccount(user) {
  let sql = `
    SELECT * FROM user
    WHERE UserID = ${user.UserID}
  `
  let p = await con.query(sql)
  if (p.length > 0) {
    sql = `
    DELETE FROM user
    WHERE UserID = ${user.UserID}
  `
    await con.query(sql)
  }
  else {
    throw Error(`User '${user.UserID}', doesn't Exist!!`)
  }
}
module.exports = { getAllUsers, getUserData, userExists, emailExists, login, register, editUsername, deleteAccount, editPassword }