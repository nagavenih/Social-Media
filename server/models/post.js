const con = require("./db_connect")

async function createTable() {
  let sql = `CREATE TABLE IF NOT EXISTS Post (
    SNo INT NOT NULL AUTO_INCREMENT,
    UserID VARCHAR(255) NOT NULL,
    PostID VARCHAR(255) NOT NULL,
    PostDetail VARCHAR(255) NOT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT SNopk PRIMARY KEY (SNo)
);`
  await con.query(sql);
}

createTable()

async function getAllPosts() {
  let sql = `SELECT * FROM Post;`
  return await con.query(sql)
}

async function getSpecificUserPosts(userpost) {
  let sql = `SELECT * FROM Post 
      WHERE UserID = ${userpost.UserID}`
  return await con.query(sql)
}

async function addpost(userpost) {
  let sql = `
      INSERT INTO Post(UserID,PostID,PostDetail)
      VALUES("${userpost.UserID}","${userpost.PostID}","${userpost.PostDetail}");`
  await con.query(sql);
  return await getSpecificUserPosts(userpost)
}

async function deleteapost(userpost) {
  let sql = `
    SELECT * FROM Post
    WHERE UserID = "${userpost.UserID}" AND PostID = "${userpost.PostID}"
  `;
  let p = await con.query(sql);

  if (p.length > 0) {
    sql = `
      DELETE FROM Post
      WHERE UserID = "${userpost.UserID}" AND PostID = "${userpost.PostID}"
    `;
    await con.query(sql);
  } else {
    throw new Error(`Post Doesn't Exist!!`);
  }
}


module.exports = { getAllPosts, getSpecificUserPosts, addpost , deleteapost}