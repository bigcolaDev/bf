import axios from "axios";
import qs from "qs";
import cron from "node-cron";
import db from "../config/database.js";
import { io } from "../server.js";

const UsersController = {
	//ฟังก์ชันสมาชิกทั้งหมด
	Users: async (req, res) => {
		try {
			db.query("SELECT * FROM users ORDER BY id DESC", (error, rows) => {
				if (error) throw error;
				rows.map((row) => {
					row.password = undefined;
				});
				const data = rows.map((row) => {
					return new Promise(async (resolve, _) => {
						const data = qs.stringify({
							username: `${process.env.UPLINE}${row.username.substring(2)}`,
						});
						const config = {
							method: "POST",
							maxBodyLength: Infinity,
							url: `${process.env.API_URL}/v4/user/balance`,
							headers: {
								"x-api-cat": process.env.API_CAT,
								"x-api-key": process.env.API_KEY,
								"Content-Type": "application/x-www-form-urlencoded", 
							},
							data: data,
						};
						await axios(config).then((response) => {
							row.balance = response.data.data.balance;
							resolve(row);
						});
					});
				});
				Promise.all(data).then((results) => {
					io.emit("server:users", results);
					res.send({ status: "success", data: results });
				});

			});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชัน user ปัจจุบัน
	CurrentUser: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM users WHERE username = ?",
				[req.body.username],
				(error, results) => {
					if (error) throw error;
					if (results.length > 0) {
						results[0].password = undefined;
						io.emit("server:current_user", results[0]);
						res.send(results[0]);
					} else {
						res.send({ message: "ไม่พบข้อมูล!" });
					}
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชัน งบดุล Agent
	AgentBalance: async (req, res) => {
		try {
			const config = {
				method: "GET",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/agent/balance?upline=${process.env.UPLINE}`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
				},
			};

			await axios(config)
				.then((response) => {
					res.send(response.data);
				});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชัน งบดุลสมาชิก
	UserBalance: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
			});
			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/balance`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: data,
			};
			await axios(config).then((response) => {
				io.emit("server:user_balance", { username: req.body.username, balance: response.data.data.balance });
				res.send(response.data);
			});
		} catch (error) {
			console.log(error);
		}
	},

	UserBalanceAll: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
			});
			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/balance`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: data,
			};
			await axios(config).then((response) => {
				io.emit("server:user_balance:all", { username: req.body.username, balance: response.data.data.balance });
				res.send(response.data);
			});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันแก้ไขข้อมูลสมาชิก
	EditUser: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
				name: req.body.name,
				tel: req.body.tel,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/edit`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: data,
			};
			await axios(config)
				.then(async (response) => {
					if (response.data.status === "error") {
						return res.send({ status: "error", message: response.data.msg });
					}
					const ref = Math.floor(1000000000 + Math.random() * 9000000000);
					const data = qs.stringify({
						username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
						amount: req.body.credit,
						ref: `update${ref}`
					});
					const config = {
						method: "POST",
						maxBodyLength: Infinity,
						url: `${process.env.API_URL}/v4/user/transfer`,
						headers: {
							"x-api-cat": process.env.API_CAT,
							"x-api-key": process.env.API_KEY,
							"Content-Type": "application/x-www-form-urlencoded",
						},
						data: data,
					};
					await axios(config).then(() => {
						db.query(
							"UPDATE users SET name = ?, tel = ?, bankName = ?, bankNumber = ?, bankCode = ?, code = ?, commission = ?, recommend = ?, cashback = ?, quantity = ?, promotion = ?, description = ?, turnoverA = ?, turn_status = ?, turn_withdraw = ? WHERE username = ?",
							[
								req.body.name,
								req.body.tel,
								req.body.bankName,
								req.body.bankNumber,
								req.body.bankCode,
								req.body.code,
								req.body.commission,
								req.body.recommend,
								req.body.cashback,
								req.body.quantity,
								req.body.promotion,
								req.body.description,
								req.body.turnoverA,
								req.body.turnStatus,
								req.body.turnWithdraw,
								req.body.username,
							],
							async (error) => {
								if (error) throw error;
								if (req.body.type === "add_credit" || req.body.type === "remove_credit") {
									const data = {
										editor: req.body.editor,
										username: req.body.username,
										credit: req.body.credit.toString().replace("-", ""),
										description: req.body.credit > 0 ? "เพิ่มเครดิต" : "ลดเครดิต"
									};
									db.query(
										"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
										[req.body.editor, req.body.type, JSON.stringify(data)]);
								} else if (req.body.type === "edit_user") {
									const data = {
										editor: req.body.editor,
										username: req.body.username,
									};
									db.query(
										"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
										[req.body.editor, req.body.type, JSON.stringify(data)]);
								}
								await axios.post(
									`${process.env.SERVER_URL}/api/v1/users/current`,
									{
										username: req.body.username,
									},
									{
										headers: {
											Authorization: `${req.headers.authorization}`,
										},
									}
								);
								res.send({ status: "success", message: "แก้ไขสำเร็จ." });
							}
						);
					});
				});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันอัพเดทสถานะของสมาชิก
	UpdateStatus: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
				status: req.body.status,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/statusSetting`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: data,
			};

			await axios(config)
				.then(() => {
					db.query(
						"UPDATE users SET status = ? WHERE username = ?",
						[req.body.status, req.body.username],
						async (error) => {
							if (error) throw error;
							res.send({ status: "success", message: "อัพเดทสถานะสำเร็จ." });
						},
					);
				});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเปลี่ยนรหัสผ่านสมาชิก
	ChangePassword: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
				new_password: req.body.new_password,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/changePassword`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: data,
			};

			await axios(config)
				.then((response) => {
					res.send(response.data);
				});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันคอมมิชชั่นปัจจุบัน
	Commission: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/commission`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: data,
			};

			await axios(config)
				.then((response) => {
					res.send(response.data);
				});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันตั้งค่าคอมมิชชั่นรายเกมส์
	CommissionSetting: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
				game: req.body.game,
				commission: req.body.commission,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/setCommission`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: data,
			};

			await axios(config)
				.then((response) => {
					res.send(response.data);
				});
		} catch (error) {
			console.log(error);
		}
	},

	// ฟังก์ชันเรียกดูขรายการ Ref1
	Ref1: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM ref WHERE ref = ?",
				[req.body.ref],
				(error, results) => {
					if (error) throw error;
					res.send(results);
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	// ฟังก์ชันเรียกดูขรายการ Ref2
	Ref2: async (req, res) => {
		try {
			db.query(
				"SELECT username, code FROM users WHERE username = ?",
				[req.body.username],
				(error, results) => {
					if (error) throw error;
					res.send(results);
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	// ฟังก์ชันเรียกดูขรายการ Summary
	Summary: async (req, res) => {
		try {
			//หน่วงเวลา 3 วินาที
			await new Promise((resolve) => setTimeout(resolve, 3000));

			const now = new Date();
			const config = {
				method: "GET",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/report/summary?start=${now.toISOString().slice(0, 10)}&end=${now.toISOString().slice(0, 10)}&username=${process.env.UPLINE}${req.body.username.substring(2)}`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
					"Content-Type": "application/x-www-form-urlencoded",
				}
			};

			await axios(config)
				.then((response) => {
					res.send(response.data);
				});
		} catch (error) {
			console.log(error);
		}
	},

	// ฟังก์ชันกดรับคอมมิชชั่น
	CommissionReceive: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM users WHERE username = ?",
				[req.body.username],
				(error, results) => {
					if (error) throw error;
					if (results[0].commission === 0) {
						return res.send({ status: "error", message: "ไม่มียอดคอมมิชชั่น!" });
					}
					if (results[0].commission < req.body.amount) {
						return res.send({ message: "error!" });
					}
					if (req.body.amount < 0) {
						return res.send({ message: "error!" });
					}
					if (typeof req.body.amount === "string") {
						return res.send({ message: "error!" });
					}
					if (req.body.amount !== results[0].commission) {
						return res.send({ message: "error!" });
					}
					db.query(
						"UPDATE users SET commission = ? WHERE username = ?",
						[results[0].commission - req.body.amount, req.body.username], async () => {
							const code = Math.floor(1000000000 + Math.random() * 9000000000);
							const data = qs.stringify({
								username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
								amount: req.body.amount,
								ref: `commission${code}`
							});
							const config = {
								method: "POST",
								maxBodyLength: Infinity,
								url: `${process.env.API_URL}/v4/user/transfer`,
								headers: {
									"x-api-cat": process.env.API_CAT,
									"x-api-key": process.env.API_KEY,
									"Content-Type": "application/x-www-form-urlencoded",
								},
								data: data,
							};
							await axios(config).then(() => {
								const data = {
									amount: req.body.amount,
									ref: `commission${code}`
								};
								db.query(
									"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
									[req.body.username, "commission", JSON.stringify(data)],
									async (error, _) => {
										if (error) throw error;
										await axios.post(
											`${process.env.SERVER_URL}/api/v1/users/current`,
											{
												username: req.body.username,
											},
											{
												headers: {
													Authorization: `${req.headers.authorization}`,
												},
											}
										);
										await axios.post(
											`${process.env.SERVER_URL}/api/v1/users/balance`,
											{
												username: req.body.username,
											},
											{
												headers: {
													Authorization: `${req.headers.authorization}`,
												},
											}
										);
										await axios.post(
											`${process.env.SERVER_URL}/api/v1/users/logs`,
											{
												username: req.body.username,
											},
											{
												headers: {
													Authorization: `${req.headers.authorization}`,
												},
											}
										);
										res.send({ status: "success", message: "รับคอมมิชชั่นสำเร็จ." });
									}
								);
							});
						}
					);
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	// ฟังก์ชันกดรับยอดแนะนำเพื่อน
	RecommendReceive: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM users WHERE username = ?",
				[req.body.username],
				(error, results) => {
					if (error) throw error;
					db.query(
						"SELECT * FROM setting WHERE type = ?", ["referral"],
						(error, referral) => {
							if (error) throw error;
							const value = JSON.parse(referral[0].data);
							const minimum = parseInt(value.withdraw);
							if (results[0].recommend === 0) {
								return res.send({ status: "error", message: "ไม่มียอดแนะนำเพื่อน!" });
							}
							if (results[0].recommend < minimum) {
								return res.send({ status: "error", message: `รับได้ขั้นต่ำ ${minimum} บาท` });
							}
							if (results[0].recommend < req.body.amount) {
								return res.send({ message: "error!" });
							}
							if (req.body.amount < 0) {
								return res.send({ message: "error!" });
							}
							if (typeof req.body.amount === "string") {
								return res.send({ message: "error!" });
							}
							if (req.body.amount !== results[0].recommend) {
								return res.send({ message: "error!" });
							}
							db.query(
								"UPDATE users SET recommend = ? WHERE username = ?",
								[results[0].recommend - req.body.amount, req.body.username], async () => {
									const code = Math.floor(1000000000 + Math.random() * 9000000000);
									const data = qs.stringify({
										username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
										amount: req.body.amount,
										ref: `recommend${code}`
									});
									const config = {
										method: "POST",
										maxBodyLength: Infinity,
										url: `${process.env.API_URL}/v4/user/transfer`,
										headers: {
											"x-api-cat": process.env.API_CAT,
											"x-api-key": process.env.API_KEY,
											"Content-Type": "application/x-www-form-urlencoded",
										},
										data: data,
									};
									await axios(config).then(() => {
										const data = {
											amount: req.body.amount,
											ref: `recommend${code}`
										};
										db.query(
											"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
											[req.body.username, "recommend", JSON.stringify(data)],
											async (error, _) => {
												if (error) throw error;
												await axios.post(
													`${process.env.SERVER_URL}/api/v1/users/current`,
													{
														username: req.body.username,
													},
													{
														headers: {
															Authorization: `${req.headers.authorization}`,
														},
													}
												);
												await axios.post(
													`${process.env.SERVER_URL}/api/v1/users/balance`,
													{
														username: req.body.username,
													},
													{
														headers: {
															Authorization: `${req.headers.authorization}`,
														},
													}
												);
												await axios.post(
													`${process.env.SERVER_URL}/api/v1/users/logs`,
													{
														username: req.body.username,
													},
													{
														headers: {
															Authorization: `${req.headers.authorization}`,
														},
													}
												);
												res.send({ status: "success", message: "รับยอดแนะนำเพื่อนสำเร็จ." });
											}
										);
									});
								}
							);
						}

					);

				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	// ฟังก์ชันกดรับยอดเสีย
	CashbackReceive: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM users WHERE username = ?",
				[req.body.username],
				(error, results) => {
					if (error) throw error;
					if (results[0].cashback === 0) {
						return res.send({ status: "error", message: "ไม่มียอดเสีย!" });
					}
					if (results[0].cashback < req.body.amount) {
						return res.send({ message: "error!" });
					}
					if (req.body.amount < 0) {
						return res.send({ message: "error!" });
					}
					if (typeof req.body.amount === "string") {
						return res.send({ message: "error!" });
					}
					if (req.body.amount !== results[0].cashback) {
						return res.send({ message: "error!" });
					}
					db.query(
						"UPDATE users SET cashback = ? WHERE username = ?",
						[results[0].cashback - req.body.amount, req.body.username], async () => {
							const code = Math.floor(1000000000 + Math.random() * 9000000000);
							const data = qs.stringify({
								username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
								amount: req.body.amount,
								ref: `cashback${code}`
							});
							const config = {
								method: "POST",
								maxBodyLength: Infinity,
								url: `${process.env.API_URL}/v4/user/transfer`,
								headers: {
									"x-api-cat": process.env.API_CAT,
									"x-api-key": process.env.API_KEY,
									"Content-Type": "application/x-www-form-urlencoded",
								},
								data: data,
							};
							await axios(config).then(() => {
								const data = {
									amount: req.body.amount,
									ref: `cashback${code}`
								};
								db.query(
									"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
									[req.body.username, "cashback", JSON.stringify(data)],
									async (error, _) => {
										if (error) throw error;
										await axios.post(
											`${process.env.SERVER_URL}/api/v1/users/current`,
											{
												username: req.body.username,
											},
											{
												headers: {
													Authorization: `${req.headers.authorization}`,
												},
											}
										);
										await axios.post(
											`${process.env.SERVER_URL}/api/v1/users/balance`,
											{
												username: req.body.username,
											},
											{
												headers: {
													Authorization: `${req.headers.authorization}`,
												},
											}
										);
										await axios.post(
											`${process.env.SERVER_URL}/api/v1/users/logs`,
											{
												username: req.body.username,
											},
											{
												headers: {
													Authorization: `${req.headers.authorization}`,
												},
											}
										);
										res.send({ status: "success", message: "รับยอดเสียสำเร็จ." });
									}
								);
							});
						}
					);
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	// ฟังก์ชันเรียกดู logs ทั้งหมด
	Logs: async (req, res) => {
		try {
			db.query(
				//เรียงลำดับจากวันที่ล่าสุด ไป วันที่เก่าสุด
				"SELECT * FROM logs ORDER BY id DESC",
				(error, results) => {
					if (error) throw error;
					io.emit("server:logs:all", results);
					res.send({ status: "success", data: results });
				}
			);
		} catch (error) {
			console.log(error);
		}
	},

	// ฟังก์ชันเรียกดู logs ของแต่ละยูสเซอร์
	LogsWithUser: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM logs WHERE username = ? ORDER BY id DESC",
				[req.body.username],
				(error, results) => {
					if (error) throw error;
					io.emit("server:logs", results);
					res.send({ status: "success", data: results });
				}
			);
		} catch (error) {
			console.log(error);
		}
	}
};

// ฟังก์ชัน อัพเดทข้อมูล แนะนำเพื่อน คืนยอดเสีย และ คอมมิชชั่น รายวัน
cron.schedule("00 23 * * *", async () => {
	try {
		db.query(
			"SELECT * FROM users", async (error, results) => {
				if (error) throw error;
				db.query(
					"SELECT * FROM ref", async (error, ref) => {
						if (error) throw error;
						for (const user of results) {
							//หน่วงเวลา 5 วินาที
							await new Promise((resolve) => setTimeout(resolve, 5000));
							const now = new Date();
							const config = {
								method: "GET",
								maxBodyLength: Infinity,
								url: `${process.env.API_URL}/v4/report/summary?start=${now.toISOString().slice(0, 10)}&end=${now.toISOString().slice(0, 10)}&username=${process.env.UPLINE}${user.username.substring(2)}`,
								headers: {
									"x-api-cat": process.env.API_CAT,
									"x-api-key": process.env.API_KEY,
									"Content-Type": "application/x-www-form-urlencoded",
								}
							};
							await axios(config)
								.then(async (response) => {
									db.query(
										"SELECT * FROM setting WHERE type = ?",
										["referral"],
										async (error, refer) => {
											if (error) throw error;
											db.query(
												"SELECT * FROM setting WHERE type = ?",
												["commission"],
												async (error, commiss) => {
													if (error) throw error;
													db.query(
														"SELECT * FROM setting WHERE type = ?",
														["cashback"],
														async (error, cash) => {
															if (error) throw error;

															const referral = JSON.parse(refer[0].data);
															const commission = JSON.parse(commiss[0].data);
															const cashback = JSON.parse(cash[0].data);

															//ref ชั้นที่ 1
															const percent1 = parseFloat(referral.level1);
															//ref ชั้นที่ 2
															const percent2 = parseFloat(referral.level2);
															//commission
															const percent3 = parseFloat(commission.percent);
															//winloss
															const percent4 = parseFloat(cashback.percent);

															//หา ref code ที่ตรงกับ user code
															const refs = ref.filter((item) => item.ref === user.code);
															const ref1 = refs.map((item) => item.username);
															const selectUserRef1 = results.filter((item) => {
																return ref1.includes(item.username);
															});
															const filterRef2 = ref.filter((item) => {
																return selectUserRef1.map((item) => item.code).includes(item.ref);
															});
															const ref2 = filterRef2.map((item) => item.username);

															const transactionRef1 = [];
															const transactionRef2 = [];

															for (const userRef1 of ref1) {
																//หน่วงเวลา 5 วินาที
																await new Promise((resolve) => setTimeout(resolve, 5000));
																const config = {
																	method: "GET",
																	maxBodyLength: Infinity,
																	url: `${process.env.API_URL}/v4/report/summary?start=${now.toISOString().slice(0, 10)}&end=${now.toISOString().slice(0, 10)}&username=${process.env.UPLINE}${userRef1.substring(2)}`,
																	headers: {
																		"x-api-cat": process.env.API_CAT,
																		"x-api-key": process.env.API_KEY,
																		"Content-Type": "application/x-www-form-urlencoded",
																	}
																};

																await axios(config)
																	.then(async (response) => {
																		transactionRef1.push(response.data.data.valid_amount);
																	});
															}

															for (const userRef2 of ref2) {
																//หน่วงเวลา 5 วินาที
																await new Promise((resolve) => setTimeout(resolve, 5000));
																const config = {
																	method: "GET",
																	maxBodyLength: Infinity,
																	url: `${process.env.API_URL}/v4/report/summary?start=${now.toISOString().slice(0, 10)}&end=${now.toISOString().slice(0, 10)}&username=${process.env.UPLINE}${userRef2.substring(2)}`,
																	headers: {
																		"x-api-cat": process.env.API_CAT,
																		"x-api-key": process.env.API_KEY,
																		"Content-Type": "application/x-www-form-urlencoded",
																	}
																};

																await axios(config)
																	.then(async (response) => {
																		transactionRef2.push(response.data.data.valid_amount);
																	});
															}

															const turnover = percent1 * transactionRef1.reduce((a, b) => a + b, 0) / 100 + percent2 * transactionRef2.reduce((a, b) => a + b, 0) / 100;

															db.query(
																"SELECT * FROM logs",
																async (error, logs) => {
																	if (error) throw error;
																	const recommendFilter = logs.filter((item) => {
																		return item.username === user.username && item.type === "recommend" && new Date(item.createdAt).toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
																	});
																	const commissionFilter = logs.filter((item) => {
																		return item.username === user.username && item.type === "commission" && new Date(item.createdAt).toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
																	});
																	const cashbackFilter = logs.filter((item) => {
																		return item.username === user.username && item.type === "cashback" && new Date(item.createdAt).toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
																	});
																	const creditFreeFilter = logs.filter((item) => {
																		return item.username === user.username && item.type === "credit-free" && new Date(item.createdAt).toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
																	});
																	const miniGameFilter = logs.filter((item) => {
																		return item.username === user.username && item.type === "minigame" && new Date(item.createdAt).toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
																	});

																	let winlossTotal = 0;

																	if (recommendFilter.length > 0) {
																		winlossTotal += JSON.parse(recommendFilter[0].data).amount;
																	}
																	if (commissionFilter.length > 0) {
																		winlossTotal += JSON.parse(commissionFilter[0].data).amount;
																	}
																	if (cashbackFilter.length > 0) {
																		winlossTotal += JSON.parse(cashbackFilter[0].data).amount;
																	}
																	if (creditFreeFilter.length > 0) {
																		winlossTotal += JSON.parse(creditFreeFilter[0].data).credit;
																	}
																	if (miniGameFilter.length > 0) {
																		winlossTotal += JSON.parse(miniGameFilter[0].data).amount;
																	}

																	// update user recommend
																	db.query(
																		"UPDATE users SET recommend = recommend + ? WHERE username = ?",
																		[turnover, user.username],
																	);

																	//insert log recommend-update
																	db.query(
																		"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
																		[user.username, "recommend-update", JSON.stringify({ amount: turnover })],
																	);

																	//update user commission
																	db.query(
																		"UPDATE users SET commission = ? WHERE username = ?",
																		[percent3 * response.data.data.valid_amount / 100, user.username],
																	);

																	//update user cashback
																	if (response.data.data.winloss + winlossTotal < 0) {
																		const winlossCheck = response.data.data.winloss + winlossTotal;
																		const winloss = winlossCheck.toString().replace("-", '');
																		db.query(
																			"UPDATE users SET cashback = ? WHERE username = ?",
																			[percent4 * parseFloat(winloss) / 100, user.username],
																		);

																	} else {
																		db.query(
																			"UPDATE users SET cashback = ? WHERE username = ?",
																			[0, user.username],
																		);
																	}

																	console.log(`update ${user.username} success`);
																}
															);

														}
													);
												}
											);

										}
									);

								});
						}
					},
				);
			}
		);
	} catch (error) {
		console.log(error);
	}
});

export default UsersController;