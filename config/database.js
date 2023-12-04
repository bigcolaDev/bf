import mysql from "mysql";

// const db = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "",
// 	database: "betflix",
// });

//DB Server
const db = mysql.createConnection({
	host: "134.209.96.165",
	user: "_root",
	password: "Zr0u8p5~4",
	database: "betflix"
});

db.connect((error) => {
	if (error) throw error;
});

export default db;
