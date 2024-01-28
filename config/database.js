import mysql from "mysql2";

// const db = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "",
// 	database: "betflix",
// });

//DB Server
const db = mysql.createConnection({
	host: '13.211.31.132',     // หรือ IP ของ MySQL server
	user: 'admin',           // ชื่อผู้ใช้ MySQL
	password: 'Test123456', // รหัสผ่าน MySQL
	database: 'betflix'     // ชื่อฐานข้อมูล MySQL
});

// เชื่อมต่อ MySQL
db.connect((err) => {
	if (err) {
		console.log(err);
	}
});


export default db;