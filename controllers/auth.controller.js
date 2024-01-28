import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import qs from "qs";
import db from "../config/database.js";

const AuthController = {
	//ฟังก์ชันสมัครสมาชิก
	Register: async (req, res) => {
		try {
			db.query("SELECT * FROM users", async (error, results) => {
				if (error) throw error;
				for (const user of results) {
					if (req.body.bankName === "wallet") {
						if (user.tel === req.body.tel) {
							return res.send({
								status: "error",
								message: "เบอร์นี้ถูกใช้งานแล้ว!",
							});
						}
					} else {
						if (user.tel === req.body.tel) {
							return res.send({
								status: "error",
								message: "เบอร์นี้ถูกใช้งานแล้ว!",
							});
						} else {
							if (user.bankNumber === req.body.bankNumber) {
								return res.send({
									status: "error",
									message: "เลขบัญชีนี้ถูกใช้งานแล้ว!",
								});
							}
						}
					}
				}

				const data = qs.stringify({
					username: req.body.username.substring(2),
					password: req.body.password,
					name: req.body.name,
					tel: req.body.tel,
				});

				const config = {
					method: "POST",
					maxBodyLength: Infinity,
					url: `${process.env.API_URL}/v4/user/register`,
					headers: {
						"x-api-cat": process.env.API_CAT,
						"x-api-key": process.env.API_KEY, 
						"Content-Type": "application/x-www-form-urlencoded",
					},
					data: data,
				};

				await axios(config).then((response) => {
					if (response.data.status === "error") {
						return res.send({
							status: "error",
							message: response.data.msg,
						});
					}

					const hash = (tel) => {
						let number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
						number[0] = "A";
						number[1] = "B";
						number[2] = "C";
						number[3] = "D";
						number[4] = "E";
						number[5] = "F";
						number[6] = "G";
						number[7] = "H";
						number[8] = "I";
						number[9] = "J";
						let hash = "";
						for (let i = 0; i < tel.length; i++) {
							hash += number[tel[i]];
						}
						return hash;
					};

					const salt = bcrypt.genSaltSync(10);
					const hashPassword = bcrypt.hashSync(req.body.password, salt);
					req.body.password = hashPassword;

					db.query(
						"INSERT INTO users (username, password, name, bankName, bankNumber, bankCode, tel, code) VALUES (?,?,?,?,?,?,?,?)",
						[
							req.body.username,
							req.body.password,
							req.body.name,
							req.body.bankName,
							req.body.bankNumber,
							req.body.bankCode,
							req.body.tel,
							hash(req.body.tel),
						],
						(error) => {
							if (error) throw error;
							if (req.body.ref) {
								db.query(
									"SELECT * FROM users WHERE code = ?",
									[req.body.ref],
									(_, results) => {
										if (results.length === 0) {
											return res.send({
												status: "success",
												message: "สมัครสมาชิกสำเร็จ.",
											});
										}
										db.query(
											"INSERT INTO ref (username, ref) VALUES (?,?)",
											[req.body.username, req.body.ref],
											(error) => {
												if (error) throw error;
												return res.send({
													status: "success",
													message: "สมัครสมาชิกสำเร็จ.",
												});
											},
										);
									},
								);
							} else {
								return res.send({
									status: "success",
									message: "สมัครสมาชิกสำเร็จ.",
								});
							}
						},
					);
				});
			});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชัน เพิ่ม สมาชิก
	AddUser: async (req, res) => {
		try {
			db.query("SELECT * FROM users", async (error, results) => {
				if (error) throw error;
				for (const user of results) {
					if (req.body.bankName === "wallet") {
						if (user.tel === req.body.tel) {
							return res.send({
								status: "error",
								message: "เบอร์นี้ถูกใช้งานแล้ว!",
							});
						}
					} else {
						if (user.tel === req.body.tel) {
							return res.send({
								status: "error",
								message: "เบอร์นี้ถูกใช้งานแล้ว!",
							});
						} else {
							if (user.bankNumber === req.body.bankNumber) {
								return res.send({
									status: "error",
									message: "เลขบัญชีนี้ถูกใช้งานแล้ว!",
								});
							}
						}
					}
				}

				const data = qs.stringify({
					username: req.body.username.substring(2),
					password: req.body.password,
					name: req.body.name,
					tel: req.body.tel,
				});

				const config = {
					method: "POST",
					maxBodyLength: Infinity,
					url: `${process.env.API_URL}/v4/user/register`,
					headers: {
						"x-api-cat": process.env.API_CAT,
						"x-api-key": process.env.API_KEY,
						"Content-Type": "application/x-www-form-urlencoded",
					},
					data: data,
				};

				await axios(config).then((response) => {
					if (response.data.status === "error") {
						return res.send({
							status: "error",
							message: response.data.msg,
						});
					}

					const hash = (tel) => {
						let number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
						number[0] = "A";
						number[1] = "B";
						number[2] = "C";
						number[3] = "D";
						number[4] = "E";
						number[5] = "F";
						number[6] = "G";
						number[7] = "H";
						number[8] = "I";
						number[9] = "J";
						let hash = "";
						for (let i = 0; i < tel.length; i++) {
							hash += number[tel[i]];
						}
						return hash;
					};

					const salt = bcrypt.genSaltSync(10);
					const hashPassword = bcrypt.hashSync(req.body.password, salt);
					req.body.password = hashPassword;

					db.query(
						"INSERT INTO users (username, password, name, bankName, bankNumber, bankCode, tel, code) VALUES (?,?,?,?,?,?,?,?)",
						[
							req.body.username,
							req.body.password,
							req.body.name,
							req.body.bankName,
							req.body.bankNumber,
							req.body.bankCode,
							req.body.tel,
							hash(req.body.tel),
						],
						(error) => {
							if (error) throw error;
							if (req.body.ref) {
								db.query(
									"SELECT * FROM users WHERE code = ?",
									[req.body.ref],
									(_, results) => {
										if (results.length === 0) {
											return res.send({
												status: "success",
												message: "สมัครสมาชิกสำเร็จ.",
											});
										}
										db.query(
											"INSERT INTO ref (username, ref) VALUES (?,?)",
											[req.body.username, req.body.ref],
											(error) => {
												if (error) throw error;
												return res.send({
													status: "success",
													message: "สมัครสมาชิกสำเร็จ.",
												});
											},
										);
									},
								);
							} else {
								return res.send({
									status: "success",
									message: "สมัครสมาชิกสำเร็จ.",
								});
							}
						},
					);
				});
			});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเข้าสู่ระบบ
	Login: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM users WHERE username = ?",
				[req.body.username],
				(error, results) => {
					if (error) throw error;
					if (results.length === 0) {
						return res.send({ status: "error", message: "ยูสเซอร์เนมไม่ถูกต้อง!" });
					}
					const isPasswordMatch = bcrypt.compareSync(
						req.body.password,
						results[0].password,
					);
					if (!isPasswordMatch) {
						return res.send({ status: "error", message: "รหัสผ่านไม่ถูกต้อง!" });
					}
					const token = jwt.sign(
						{
							id: results[0].id,
							username: results[0].username,
							name: results[0].name,
							bankName: results[0].bankName,
							bankNumber: results[0].bankNumber,
							bankCode: results[0].bankCode,
							tel: results[0].tel,
						},
						process.env.SECRET_KEY,
						{ expiresIn: "1d" },
					);
					const data = {
						ip: req.body.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
						agent: req.headers["user-agent"],
					};
					db.query(
						"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
						[req.body.username, "login", JSON.stringify(data)],
						async (error, _) => {
							if (error) throw error;
							res.header("Authorization", `Bearer ${token}`);
							res.send({ status: "success", token });
							await axios.get(
								`${process.env.SERVER_URL}/users/logs/all`,
							);
						},
					);

				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเช็ค token ของ user
	UserToken: async (req, res) => {
		try {
			const token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.SECRET_KEY);
			if (decoded) {
				return res.send({ username: decoded.username, exp: decoded.exp });
			}
		} catch (error) {
			console.log(error);
		}
	},
};

export default AuthController;
