import mysql from "mysql2";

//DB Server
const db = mysql.createConnection({
	host: process.env.DB_HOST || 'localhost',     // หรือ IP ของ MySQL server
	user: process.env.DB_USER || 'root',           // ชื่อผู้ใช้ MySQL
	password: process.env.DB_PASSWORD || '', // รหัสผ่าน MySQL
	database: process.env.DB_NAME || 'betflix',     // ชื่อฐานข้อมูล MySQL
});

// เชื่อมต่อ MySQL
db.connect((err) => {
	if (err) {
		console.log(err);
	}
});


export default db;