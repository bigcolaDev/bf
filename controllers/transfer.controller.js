import axios from "axios";
import qs from "qs";
import cron from "node-cron";
import FormData from "form-data";
import db from "../config/database.js";
import bankList from "../bankList.js";

const randomRef = (length) => {
	let result = "";
	const now = new Date();
	const date = now.getTime();
	const numbers = "0123456789";
	for (let i = 0; i < length; i++) {
		result += numbers.charAt(Math.floor(Math.random() * numbers.length));
	}
	return `${date}${result}`;
};

const TransferController = {
	//ฟังก์ชันเรียกดูยอดเงินคงเหลือ
	Balance: async (req, res) => {
		try {
			const config = {
				method: "GET",
				maxBodyLength: Infinity,
				url: "http://122.248.204.147:8080/scb-api/balance.php",
			};
			await axios(config)
				.then((response) => {
					res.send({ status: "success", data: response.data });
				});
		} catch (error) {
			console.log(error);
		}
	},
	//ฟังก์ชันโอนเงิน
	HanlderTransfer: async (req, res) => {
		try {
			const formData = new FormData();
			if (req.body.toBankCode !== "") {
				formData.append('bankCode', req.body.toBankCode);
				formData.append('transferTo', req.body.toBankNumber);
				formData.append('amount', parseInt(req.body.amount));
			} else {
				formData.append('tel', req.body.toBankNumber);
				formData.append('amount', parseInt(req.body.amount));
			}
			const config = {
				method: 'POST',
				maxBodyLength: Infinity,
				url: req.body.toBankCode !== "" ? "http://122.248.204.147:8080/scb-api/transfer.php" : "http://122.248.204.147:8080/scb-api/truewallet.php",
				headers: {
					...formData.getHeaders()
				},
				data: formData
			};
			await axios(config).then(async (response) => {
				if (response.data !== "success") return res.send({ status: "error", message: "ผิดพลาด API !" });
				db.query(
					"INSERT INTO transfer (fromName, fromBankName, fromBankNumber, toName, toBankName, toBankNumber, toBankCode, amount, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					[
						req.body.fromName,
						req.body.fromBankName,
						req.body.fromBankNumber,
						req.body.toName,
						req.body.toBankName,
						req.body.toBankNumber,
						req.body.toBankCode,
						parseInt(req.body.amount),
						req.body.note,
						1,
					],
				);
				const data = {
					creator: req.body.creator,
					fromName: req.body.fromName,
					fromBankName: req.body.fromBankName,
					fromBankNumber: req.body.fromBankNumber,
					toName: req.body.toName,
					toBankName: req.body.toBankName,
					toBankNumber: req.body.toBankNumber,
					toBankCode: req.body.toBankCode,
					amount: parseInt(req.body.amount),
					note: req.body.note,
				};
				db.query(
					"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
					[
						req.body.creator,
						"transfer",
						JSON.stringify(data),
					],
				);
				res.send({ status: "success", message: "โอนเงินเรียบร้อย." });

			});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเรียกดูรายการโอนเงิน
	HanlderTransferList: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM transfer ORDER BY id DESC",
				[],
				async (error, results) => {
					if (error) throw error;
					res.send({ status: "success", data: results });
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันอัพเดทสถานะการฝากเงิน
	HanlderDeposit: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM deposit WHERE id = ?",
				[req.body.id],
				async (error, deposit) => {
					if (error) throw error;
					if (deposit.length === 0) {
						return res.send({ status: "error", message: "ไม่พบรายการฝากเงินนี้!" });
					}

					if (deposit[0].status === 1 || deposit[0].status === 2) {
						return res.send({ status: "error", message: "รายการนี้ได้รับการยืนยันแล้ว!" });
					}

					if (req.body.status === 2) {
						db.query(
							"UPDATE deposit SET status = ? WHERE id = ?",
							[req.body.status, req.body.id],
							async (error, _) => {
								if (error) throw error;
								res.send({ status: "success", message: "อัพเดทสถานะการฝากเงินเรียบร้อย." });
							}
						);
					} else {
						const data = qs.stringify({
							username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
							amount: parseInt(req.body.amount),
							ref: randomRef(6),
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

						await axios(config).then(async (response) => {
							if (response.data.status === "error") return res.send({ status: "error", message: response.data.msg });
							db.query(
								"UPDATE deposit SET status = ? WHERE id = ?",
								[req.body.status, req.body.id],
								async (error, _) => {
									if (error) throw error;
									db.query(
										"SELECT * FROM setting WHERE type = ?",
										["mini_game"],
										async (error, setting) => {
											if (error) throw error;
											const data = await JSON.parse(setting[0].data);
											if (parseInt(req.body.amount) >= parseInt(data.amount)) {
												db.query(
													"UPDATE users SET quantity = quantity + ? WHERE username = ?",
													[1, req.body.username],
												);
											}
											await axios.post(
												`${process.env.SERVER_URL}/users/balance`,
												{
													username: req.body.username,
												},
												{
													headers: {
														Authorization: `${req.headers.authorization}`,
													},
												}
											);
											res.send({ status: "success", message: "อัพเดทสถานะการฝากเงินเรียบร้อย." });
										}
									);

								}
							);
						});
					}
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันอัพเดทสถานะการถอนเงิน
	HanlderWithdraw: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM withdraw WHERE id = ?",
				[req.body.id],
				async (error, withdraw) => {
					if (error) throw error;
					if (withdraw.length === 0) {
						return res.send({ status: "error", message: "ไม่พบรายการฝากเงินนี้!" });
					}
					if (withdraw[0].status === 1 || withdraw[0].status === 2) {
						return res.send({ status: "error", message: "รายการนี้ได้รับการยืนยันแล้ว!" });
					}
					if (req.body.bankCode === "") {
						if (parseInt(req.body.amount) < 100) {
							return res.send({ status: "error", message: "ถอนขั้นต่ำ 100 บาท!" });
						}
					}
					if (req.body.status === 2) {
						db.query(
							"UPDATE withdraw SET status = ? WHERE id = ?",
							[req.body.status, req.body.id],
							async (error, _) => {
								if (error) throw error;
								res.send({ status: "success", message: "อัพเดทสถานะการถอนเงินเรียบร้อย." });
							}
						);
					} else {
						const formData = new FormData();
						if (req.body.bankCode !== "") {
							formData.append('bankCode', req.body.bankCode);
							formData.append('transferTo', req.body.bankNumber);
							formData.append('amount', parseInt(req.body.amount));
						} else {
							formData.append('tel', req.body.bankNumber);
							formData.append('amount', parseInt(req.body.amount));
						}
						const config = {
							method: 'POST',
							maxBodyLength: Infinity,
							url: req.body.bankCode !== "" ? "http://122.248.204.147:8080/scb-api/transfer.php" : "http://122.248.204.147:8080/scb-api/truewallet.php",
							headers: {
								...formData.getHeaders()
							},
							data: formData
						};
						await axios(config).then(async (response) => {
							if (response.data !== "success") return res.send({ status: "error", message: "ผิดพลาด API !" });
							db.query(
								"UPDATE withdraw SET status = ? WHERE id = ?",
								[req.body.status, req.body.id],
								async (error, _) => {
									if (error) throw error;
									res.send({ status: "success", message: "อัพเดทสถานะการถอนเงินเรียบร้อย." });
									await axios.post(
										`${process.env.SERVER_URL}/users/balance`,
										{
											username: req.body.username,
										},
										{
											headers: {
												Authorization: `${req.headers.authorization}`,
											},
										}
									);
								}
							);
						});
					}
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเรียกดูรายการฝากเงิน
	DepositWithUser: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM deposit WHERE username = ?",
				[req.body.username],
				(error, results) => {
					if (error) throw error;
					res.send({ status: "success", data: results });
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเรียกดูรายการฝากเงิน ของ user ทั้งหมด
	DepositList: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM deposit WHERE created = ? ORDER BY id DESC",
				[0],
				(error, results) => {
					if (error) throw error;
					res.send({ status: "success", data: results });
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเรียกดูรายการถอนเงิน
	WithdrawWithUser: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM withdraw WHERE username = ?",
				[req.body.username],
				async (error, results) => {
					if (error) throw error;
					res.send({ status: "success", data: results });
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเรียกดูรายการถอนเงิน ของ user ทั้งหมด
	withdrawList: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM withdraw WHERE created = ? ORDER BY id DESC",
				[0],
				(error, results) => {
					if (error) throw error;
					res.send({ status: "success", data: results });
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันถอนเงิน
	Withdraw: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM users WHERE username = ?",
				[req.body.username],
				async (error, user) => {
					if (error) throw error;
					if (user.length === 0) {
						return res.send({ status: "error", message: "ไม่พบผู้ใช้งานนี้!" });
					}
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
					await axios(config).then(async (response) => {
						if (response.data.status === "error") {
							return res.send(response.data);
						}
						db.query(
							"SELECT * FROM setting WHERE type = ?",
							["limit_withdraw"],
							async (error, results) => {
								if (error) throw error;
								const value = JSON.parse(results[0].data);
								if (user[0].turn_status == 1) {
									const turnOverA = user[0].turnoverA;
									const turnOverB = user[0].turnoverB;
									const left = turnOverA - turnOverB;
									return res.send({ status: "error", message: `เหลืออีก ${left} เทิร์น!` });

								}
								if (user[0].turn_withdraw > 0) {
									if (req.body.amount > user[0].turn_withdraw) {
										return res.send({ status: "error", message: `คุณถอน จากยอดเทิร์น ได้ไม่เกิน ${user[0].turn_withdraw} บาท!` });
									}
								} else {
									if (response.data.data.balance < parseInt(req.body.amount)) {
										return res.send({ status: "error", message: "ยอดเงินไม่เพียงพอ!" });
									}
									if (req.body.bankName === "wallet") {
										if (parseInt(req.body.amount) < 100) {
											return res.send({ status: "error", message: "ถอนขั้นต่ำ 100 บาท!" });
										}
									}
									if (parseInt(req.body.amount) < parseInt(value.min)) {
										return res.send({ status: "error", message: `ถอนขั้นต่ำ ${parseInt(value.min)} บาท!` });
									}
									if (parseInt(req.body.amount) > parseInt(value.max)) {
										// return res.send({ status: "error", message: `ถอนสูงสุดไม่เกิน ${parseInt(value.max)} บาท!` });
										const data = qs.stringify({
											username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
											amount: parseInt(user[0].turn_withdraw) > 0 ? -parseInt(response.data.data.balance) : -parseInt(req.body.amount),
											ref: randomRef(6),
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
										await axios(config).then(async () => {
											db.query(
												"INSERT INTO withdraw (type , username, name, bankName, bankNumber, bankCode, toBankName, referenceNo, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
												[
													"not-auto",
													req.body.username,
													req.body.name,
													"ไทยพาณิชย์",
													req.body.bankName !== "wallet" ? req.body.bankNumber : req.body.tel,
													req.body.bankName !== "wallet" ? req.body.bankCode : "",
													req.body.bankName,
													randomRef(6),
													parseInt(req.body.amount),
													0
												],
											);
										});
										db.query(
											"UPDATE users SET promotion = ?, description = ?, turn_withdraw	= ? WHERE username = ?",
											[0, "", 0, req.body.username],
										);
										res.send({ status: "success", message: "แจ้งถอนเงินเรียบร้อย." });
										await axios.post(
											`${process.env.SERVER_URL}/users/balance`,
											{
												username: req.body.username,
											},
											{
												headers: {
													Authorization: `${req.headers.authorization}`,
												},
											}
										);
										return false;
									}
									if (parseInt(req.body.amount) < 0) {
										return res.send({ status: "error", message: "error!" });
									}
									if (typeof parseInt(req.body.amount) === "string") {
										return res.send({ status: "error", message: "error!" });
									}

								}

								const formData = new FormData();

								if (req.body.bankName !== "wallet") {
									formData.append('bankCode', req.body.bankCode);
									formData.append('transferTo', req.body.bankNumber);
									formData.append('amount', parseInt(req.body.amount));
								} else {
									formData.append('tel', req.body.tel);
									formData.append('amount', parseInt(req.body.amount));
								}

								const config = {
									method: 'POST',
									maxBodyLength: Infinity,
									url: req.body.bankName !== "wallet" ? "http://122.248.204.147:8080/scb-api/transfer.php" : "http://122.248.204.147:8080/scb-api/truewallet.php",
									headers: {
										...formData.getHeaders()
									},
									data: formData
								};

								const data = qs.stringify({
									username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
									amount: parseInt(user[0].turn_withdraw) > 0 ? -parseInt(response.data.data.balance) : -parseInt(req.body.amount),
									ref: randomRef(6),
								});
								await axios(config).then(async (response) => {
									if (response.data === "success") {
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
										await axios(config).then(async () => {
											db.query(
												"INSERT INTO withdraw (type , username, name, bankName, bankNumber, bankCode, toBankName, referenceNo, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
												[
													"auto",
													req.body.username,
													req.body.name,
													"ไทยพาณิชย์",
													req.body.bankName !== "wallet" ? req.body.bankNumber : req.body.tel,
													req.body.bankName !== "wallet" ? req.body.bankCode : "",
													req.body.bankName,
													randomRef(6),
													parseInt(req.body.amount),
													1
												],
											);
											db.query(
												"UPDATE users SET promotion = ?, description = ?, turn_withdraw	= ? WHERE username = ?",
												[0, "", 0, req.body.username],
											);
											res.send({ status: "success", message: "แจ้งถอนเงินเรียบร้อย." });
											await axios.post(
												`${process.env.SERVER_URL}/users/balance`,
												{
													username: req.body.username,
												},
												{
													headers: {
														Authorization: `${req.headers.authorization}`,
													},
												}
											);
										});
									} else {
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
										axios(config).then(async () => {
											db.query(
												"INSERT INTO withdraw (type , username, name, bankName, bankNumber, bankCode, toBankName, referenceNo, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
												[
													"not-auto",
													req.body.username,
													req.body.name,
													"ไทยพาณิชย์",
													req.body.bankName !== "wallet" ? req.body.bankNumber : req.body.tel,
													req.body.bankName !== "wallet" ? req.body.bankCode : "",
													req.body.bankName,
													randomRef(6),
													parseInt(req.body.amount),
													0
												],
											);
											db.query(
												"UPDATE users SET promotion = ?, description = ?, turn_withdraw	= ? WHERE username = ?",
												[0, "", 0, req.body.username],
											);
											res.send({ status: "success", message: "แจ้งถอนเงินเรียบร้อย." });
											await axios.post(
												`${process.env.SERVER_URL}/users/balance`,
												{
													username: req.body.username,
												},
												{
													headers: {
														Authorization: `${req.headers.authorization}`,
													},
												}
											);
										});

									}
								}).catch(() => {
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
									axios(config).then(async () => {
										db.query(
											"INSERT INTO withdraw (type , username, name, bankName, bankNumber, bankCode, toBankName, referenceNo, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
											[
												"not-auto",
												req.body.username,
												req.body.name,
												"ไทยพาณิชย์",
												req.body.bankName !== "wallet" ? req.body.bankNumber : req.body.tel,
												req.body.bankName !== "wallet" ? req.body.bankCode : "",
												req.body.bankName,
												randomRef(6),
												parseInt(req.body.amount),
												0
											],
										);
										db.query(
											"UPDATE users SET promotion = ?, description = ?, turn_withdraw	= ? WHERE username = ?",
											[0, "", 0, req.body.username],
										);
										res.send({ status: "success", message: "แจ้งถอนเงินเรียบร้อย." });
										await axios.post(
											`${process.env.SERVER_URL}/users/balance`,
											{
												username: req.body.username,
											},
											{
												headers: {
													Authorization: `${req.headers.authorization}`,
												},
											}
										);
									});
								});

							});
					});
				},
			);
		} catch (error) {
			res.send({ message: "ทำรายการล้มเหลว! กรุณาติดต่อแอดมิน!" });
		}
	},

	//ฟังก์ชันประวัติการฝากถอน
	TransferHistory: async (req, res) => {
		try {
			const config = {
				method: "GET",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/transferHistory?username=${process.env.UPLINE}${req.body.username.substring(2)}&start=${req.body.start}&end=${req.body.end}`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
				},
			};

			await axios(config)
				.then((response) => {
					res.send({ status: "success", data: response.data });
				});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันประวัติธุรกรรมทั้งหมด
	TransferHistoryAll: async (req, res) => {
		try {
			const config = {
				method: "GET",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/creditHistory?username=${process.env.UPLINE}${req.body.username.substring(2)}`,
				headers: {
					"x-api-cat": process.env.API_CAT,
					"x-api-key": process.env.API_KEY,
				},
			};
			await axios(config)
				.then((response) => {
					res.send({ status: "success", data: response.data });
				});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันสร้างรายการฝาก
	CreateDeposit: async (req, res) => {
		try {
			db.query(
				"INSERT INTO deposit SET type = ?, username = ?, name = ?, bankName = ?, bankNumber = ?, bankCode = ?, toBankName = ?, amount = ?, referenceNo = ?, note = ?, created = ?,  status = ?, createdAt = ?",
				["not-auto", req.body.username, req.body.name, req.body.bankName, req.body.bankNumber, req.body.bankCode, req.body.toBankName, req.body.amount, randomRef(6), req.body.note, 1, 0, req.body.createdAt],
				async (error, _) => {
					if (error) throw error;
					const data = {
						creator: req.body.creator,
						username: req.body.username,
						name: req.body.name,
						fromBankName: req.body.bankName,
						bankNumber: req.body.bankNumber,
						toBankName: req.body.toBankName,
						amount: req.body.amount,
						note: req.body.note,
						createdAt: moment(req.body.createdAt).format("YYYY-MM-DD HH:mm:ss"),
					};
					db.query(
						"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
						[req.body.creator, req.body.type, JSON.stringify(data)]);

					res.send({ status: "success", message: "สร้างรายการฝากเงินเรียบร้อย." });
				}
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันสร้างรายการถอน
	CreateWithdraw: async (req, res) => {
		try {
			db.query(
				"INSERT INTO withdraw SET type = ?, username = ?, name = ?, bankName = ?, bankNumber = ?, bankCode = ?, toBankName = ?, amount = ?, referenceNo = ?, note = ?, created = ?, status = ?, createdAt = ?",
				["not-auto", req.body.username, req.body.name, req.body.bankName, req.body.bankNumber, req.body.bankCode, req.body.toBankName, req.body.amount, randomRef(6), req.body.note, 1, 0, req.body.createdAt],
				async (error, _) => {
					if (error) throw error;
					const data = {
						creator: req.body.creator,
						username: req.body.username,
						name: req.body.name,
						fromBankName: req.body.bankName,
						toBankName: req.body.toBankName,
						bankNumber: req.body.bankNumber,
						amount: req.body.amount,
						note: req.body.note,
						createdAt: moment(req.body.createdAt).format("YYYY-MM-DD HH:mm:ss")
					};
					db.query(
						"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
						[req.body.creator, req.body.type, JSON.stringify(data)]);

					res.send({ status: "success", message: "สร้างรายการถอนเงินเรียบร้อย." });
				}
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเรียกดูรายการฝากที่สร้าง
	CreateDepositList: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM deposit WHERE created = ? ORDER BY id DESC",
				[1],
				(error, results) => {
					if (error) throw error;
					res.send({ status: "success", data: results });
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชันเรียกดูรายการถอนที่สร้าง
	CreateWithdrawList: async (req, res) => {
		try {
			db.query(
				"SELECT * FROM withdraw WHERE created = ? ORDER BY id DESC",
				[1],
				(error, results) => {
					if (error) throw error;
					res.send({ status: "success", data: results });
				},
			);
		} catch (error) {
			console.log(error);
		}
	},

	DetectBankAccount: async (req, res) => {
		try {
			const data = new FormData();
			data.append('bankCode', req.body.bankCode);
			data.append('bankNumber', req.body.bankNumber);

			const config = {
				method: 'post',
				maxBodyLength: Infinity,
				url: 'http://122.248.204.147:8080/scb-api/verify.php',
				headers: {
					...data.getHeaders()
				},
				data: data
			};
			await axios.request(config)
				.then((response) => {
					res.send({ status: "success", data: response.data });
				});
		} catch (error) {
			console.log(error);
		}
	},
};

//ไทยพาณิชย์
// cron.schedule("*/20 * * * * *", async () => {
// 	try {
// 		// Function to retrieve data from the table
// 		function getTable(table) {
// 			return new Promise((resolve, reject) => {
// 				db.query(`SELECT * FROM ${table}`, (error, table) => {
// 					if (error) reject(error);
// 					resolve(table);
// 				});
// 			});
// 		}

// 		const deposit = await getTable("deposit");
// 		const setting = await getTable("setting");
// 		const users = await getTable("users");

// 		// Function to retrieve data from SCB
// 		function getScb() {
// 			return new Promise((resolve, _reject) => {
// 				const config = {
// 					method: "GET",
// 					url: "http://122.248.204.147:8080/scb-api",
// 				};
// 				axios(config).then(async (response) => {
// 					resolve(response.data.transactions);
// 				});
// 			});
// 		}

// 		const scb = await getScb();
// 		if (scb === undefined) return false;

// 		// Logic for deposit transactions
// 		const transactions = scb.filter((item) => item.type.description === "ฝากเงิน");
// 		const transDep = transactions.filter((item) =>
// 			deposit.map((d) => parseFloat(d.amount).toFixed(2) !== parseFloat(item.amount).toFixed(2)) &&
// 			!deposit.map((d) => d.referenceNo).includes(item.txHash.match(/\d/g).join("")) &&
// 			!deposit.map((d) => d.createdAt).includes(item.dateTime)
// 		);

// 		transDep.map(async (item) => {
// 			const bankslist = bankList.filter((bank) => bank.initials === item.remark.bank);
// 			const banks = bankslist.map((item) => item.shortname);
// 			const user = users.filter((user) => user.bankNumber.slice(user.bankName === "ไทยพาณิชย์" ? -4 : -6) === item.remark.number && banks.includes(user.bankName));
// 			if (user.length === 0) return false;
// 			const limitDeposit = await setting.filter((item) => item.type === "limit_deposit");
// 			const limit = await JSON.parse(limitDeposit[0].data);

// 			function SAVE(type, username, name, bankName, bankNumber, bankCode, toBankName, amount, referenceNo, status, createdAt) {
// 				db.query(
// 					"INSERT INTO deposit SET type = ?, username = ?, name = ?, bankName = ?, bankNumber = ?, bankCode = ?, toBankName = ?, amount = ?, referenceNo = ?,  status = ? , createdAt = ?",
// 					[type, username, name, bankName, bankNumber, bankCode, toBankName, amount, referenceNo, status, createdAt],
// 					async () => {
// 						if (type === "auto") {
// 							const detail = qs.stringify({
// 								username: `${process.env.UPLINE}${username.substring(2)}`,
// 								amount: parseFloat(amount),
// 								ref: referenceNo,
// 							});
// 							const config = {
// 								method: "POST",
// 								maxBodyLength: Infinity,
// 								url: `${process.env.API_URL}/v4/user/transfer`,
// 								headers: {
// 									"x-api-cat": process.env.API_CAT,
// 									"x-api-key": process.env.API_KEY,
// 									"Content-Type": "application/x-www-form-urlencoded",
// 								},
// 								data: detail,
// 							};
// 							await axios(config).then(async (response) => {
// 								if (response.data.status === "error") {
// 									return false;
// 								}
// 								db.query(
// 									"SELECT * FROM setting WHERE type = ?",
// 									["mini_game"],
// 									async (error, setting) => {
// 										if (error) throw error;
// 										const data = await JSON.parse(setting[0].data);
// 										if (parseInt(amount) >= parseInt(data.amount)) {
// 											db.query(
// 												"UPDATE users SET quantity = quantity + ? WHERE username = ?",
// 												[1, username],
// 											);
// 										}
// 										await axios.post(`${process.env.SERVER_URL}/notify`,
// 											{
// 												username: username,
// 												amount: parseFloat(amount).toFixed(2),
// 											}
// 										);
// 									}
// 								);
// 							}
// 							);
// 						}
// 					}
// 				);
// 			}

// 			await user.map(async (user) => {
// 				if (parseFloat(item.amount) < parseFloat(limit.min)) {
// 					SAVE("not-auto", user.username, user.name, user.bankName, user.bankNumber, user.bankCode, "ไทยพาณิชย์", parseFloat(item.amount), item.txHash.match(/\d/g).join(""), 0, item.dateTime);
// 					return false;
// 				} else if (parseFloat(item.amount) > parseFloat(limit.max)) {
// 					SAVE("not-auto", user.username, user.name, user.bankName, user.bankNumber, user.bankCode, "ไทยพาณิชย์", parseFloat(item.amount), item.txHash.match(/\d/g).join(""), 0, item.dateTime);
// 					return false;
// 				} else {
// 					if (user.promotion === 1 && user.running === 0) {
// 						if (user.depositType === "ตรงยอด") {
// 							if (parseFloat(item.amount) === parseFloat(user.deposit)) {
// 								SAVE("auto", user.username, user.name, user.bankName, user.bankNumber, user.bankCode, "ไทยพาณิชย์", parseFloat(user.maxBonus), item.txHash.match(/\d/g).join(""), 1, item.dateTime);
// 							}
// 							return false;
// 						} else if (user.depositType === "ต่ำกว่า") {
// 							if (parseFloat(item.amount) <= parseFloat(user.deposit)) {
// 								const detail = qs.stringify({
// 									username: `${process.env.UPLINE}${user.username.substring(2)}`,
// 									amount: parseFloat(user.maxBonus),
// 									ref: item.txHash.match(/\d/g).join(""),
// 								});
// 								const config = {
// 									method: "POST",
// 									maxBodyLength: Infinity,
// 									url: `${process.env.API_URL}/v4/user/transfer`,
// 									headers: {
// 										"x-api-cat": process.env.API_CAT,
// 										"x-api-key": process.env.API_KEY,
// 										"Content-Type": "application/x-www-form-urlencoded",
// 									},
// 									data: detail,
// 								};
// 								await axios(config).then(async (response) => {
// 									if (response.data.status === "error") {
// 										return false;
// 									}
// 									SAVE("auto", user.username, user.name, user.bankName, user.bankNumber, user.bankCode, "ไทยพาณิชย์", parseFloat(user.maxBonus), item.txHash.match(/\d/g).join(""), 1, item.dateTime);
// 								});
// 							}
// 							return false;
// 						}
// 						return false;
// 					}
// 					SAVE("auto", user.username, user.name, user.bankName, user.bankNumber, user.bankCode, "ไทยพาณิชย์", parseFloat(item.amount), item.txHash.match(/\d/g).join(""), 1, item.dateTime);
// 				}
// 			});
// 		});

// 	} catch (error) {
// 		console.log(error);
// 	}
// });


//true wallet
// cron.schedule("* * * * * *", async () => {
// 	try {
// 		db.query("SELECT * FROM deposit", async (error, deposit) => {
// 			if (error) throw error;
// 			const config = {
// 				method: "GET",
// 				url: "http://122.248.204.147:3003",
// 			};
// 			await axios(config).then(async (response) => {
// 				const tw = response.data;
// 				await tw.map(async (item) => {
// 					db.query("SELECT * FROM setting", async (error, setting) => {
// 						if (error) throw error;
// 						const limitDeposit = await setting.filter((item) => item.type === "limit_deposit");
// 						if (!limitDeposit[0]) return false;
// 						const data = await JSON.parse(limitDeposit[0].data);
// 						if (!deposit.map((item) => item.referenceNo).includes(item.received_time.match(/\d/g).join(""))) {
// 							db.query("SELECT * FROM users", async (error, users) => {
// 								if (error) throw error;
// 								await users.map(async (user) => {
// 									if (user.tel === item.sender) {
// 										if (parseFloat(item.amount) < parseFloat(data.min)) {
// 											db.query(
// 												"INSERT INTO deposit SET type = ?, username = ?, name = ?, bankName = ?, bankNumber = ?, toBankName = ?, amount = ?, referenceNo = ?,  status = ? , createdAt = ?",
// 												["not-auto", user.username, user.name, "wallet", user.tel, "wallet", parseFloat(item.amount), item.received_time.match(/\d/g).join(""), 0, item.received_time],
// 												async () => {
// 													return console.log({
// 														username: user.username,
// 														amount: parseFloat(item.amount),
// 														limit: data.min,
// 													});
// 												});
// 										} else if (parseFloat(item.amount) > parseFloat(data.max)) {
// 											db.query(
// 												"INSERT INTO deposit SET type = ?, username = ?, name = ?, bankName = ?, bankNumber = ?, toBankName = ?, amount = ?, referenceNo = ?,  status = ? , createdAt = ?",
// 												["not-auto", user.username, user.name, "wallet", user.tel, "wallet", parseFloat(item.amount), item.received_time.match(/\d/g).join(""), 0, item.received_time],
// 												async () => {
// 													return console.log({
// 														username: user.username,
// 														amount: parseFloat(item.amount),
// 														limit: data.max,
// 													});
// 												});
// 										} else {
// 											if (user.promotion === 1 && user.running === 0) {
// 												if (user.depositType === "ตรงยอด") {
// 													if (parseFloat(item.amount) === parseFloat(user.deposit)) {
// 														const detail = qs.stringify({
// 															username: `${process.env.UPLINE}${user.username.substring(2)}`,
// 															amount: parseFloat(user.maxBonus),
// 															ref: item.received_time.match(/\d/g).join(""),
// 														});
// 														const config = {
// 															method: "POST",
// 															maxBodyLength: Infinity,
// 															url: `${process.env.API_URL}/v4/user/transfer`,
// 															headers: {
// 																"x-api-cat": process.env.API_CAT,
// 																"x-api-key": process.env.API_KEY,
// 																"Content-Type": "application/x-www-form-urlencoded",
// 															},
// 															data: detail,
// 														};
// 														await axios(config).then(async (response) => {
// 															if (response.data.status === "error") {
// 																return false;
// 															}
// 															db.query(
// 																"INSERT INTO deposit SET type = ?, username = ?, name = ?, bankName = ?, bankNumber = ?, toBankName = ?, amount = ?, referenceNo = ?,  status = ? , createdAt = ?",
// 																["auto", user.username, user.name, "wallet", user.tel, "wallet", parseFloat(user.maxBonus), item.received_time.match(/\d/g).join(""), 1, item.received_time],
// 																async () => {
// 																	db.query(
// 																		"SELECT * FROM setting WHERE type = ?",
// 																		["mini_game"],
// 																		async (error, setting) => {
// 																			if (error) throw error;
// 																			const data = await JSON.parse(setting[0].data);
// 																			if (parseInt(item.amount) >= parseInt(data.amount)) {
// 																				db.query(
// 																					"UPDATE users SET quantity = quantity + ?, running = ? WHERE username = ?",
// 																					[1, 1, user.username],
// 																				);
// 																				await axios.post(`${process.env.SERVER_URL}/notify`,
// 																					{
// 																						username: user.username,
// 																						amount: parseFloat(user.maxBonus).toFixed(2),
// 																					}
// 																				);
// 																			}
// 																		}
// 																	);
// 																});
// 														});
// 													}
// 												} else if (user.depositType === "ต่ำกว่า") {
// 													if (parseFloat(item.amount) <= parseFloat(user.deposit)) {
// 														const detail = qs.stringify({
// 															username: `${process.env.UPLINE}${user.username.substring(2)}`,
// 															amount: parseFloat(user.maxBonus),
// 															ref: item.received_time.match(/\d/g).join(""),
// 														});
// 														const config = {
// 															method: "POST",
// 															maxBodyLength: Infinity,
// 															url: `${process.env.API_URL}/v4/user/transfer`,
// 															headers: {
// 																"x-api-cat": process.env.API_CAT,
// 																"x-api-key": process.env.API_KEY,
// 																"Content-Type": "application/x-www-form-urlencoded",
// 															},
// 															data: detail,
// 														};
// 														await axios(config).then(async (response) => {
// 															if (response.data.status === "error") {
// 																return false;
// 															}
// 															db.query(
// 																"INSERT INTO deposit SET type = ?, username = ?, name = ?, bankName = ?, bankNumber = ?, toBankName = ?, amount = ?, referenceNo = ?,  status = ? , createdAt = ?",
// 																["auto", user.username, user.name, "wallet", user.tel, "wallet", parseFloat(user.maxBonus), item.received_time.match(/\d/g).join(""), 1, item.received_time],
// 																async () => {
// 																	db.query(
// 																		"SELECT * FROM setting WHERE type = ?",
// 																		["mini_game"],
// 																		async (error, setting) => {
// 																			if (error) throw error;
// 																			const data = await JSON.parse(setting[0].data);
// 																			if (parseInt(item.amount) >= parseInt(data.amount)) {
// 																				db.query(
// 																					"UPDATE users SET quantity = quantity + ?, running = ? WHERE username = ?",
// 																					[1, 1, user.username],
// 																				);
// 																				await axios.post(`${process.env.SERVER_URL}/notify`,
// 																					{
// 																						username: user.username,
// 																						amount: parseFloat(user.maxBonus).toFixed(2),
// 																					}
// 																				);

// 																			}
// 																		}
// 																	);
// 																});
// 														});
// 													}
// 												}
// 											} else {
// 												const detail = qs.stringify({
// 													username: `${process.env.UPLINE}${user.username.substring(2)}`,
// 													amount: parseFloat(item.amount),
// 													ref: item.received_time.match(/\d/g).join(""),
// 												});
// 												const config = {
// 													method: "POST",
// 													maxBodyLength: Infinity,
// 													url: `${process.env.API_URL}/v4/user/transfer`,
// 													headers: {
// 														"x-api-cat": process.env.API_CAT,
// 														"x-api-key": process.env.API_KEY,
// 														"Content-Type": "application/x-www-form-urlencoded",
// 													},
// 													data: detail,
// 												};
// 												await axios(config).then(async (response) => {
// 													if (response.data.status === "error") {
// 														return false;
// 													}
// 													db.query(
// 														"INSERT INTO deposit SET type = ?, username = ?, name = ?, bankName = ?, bankNumber = ?, toBankName = ?, amount = ?, referenceNo = ?,  status = ? , createdAt = ?",
// 														["auto", user.username, user.name, "wallet", user.tel, "wallet", parseFloat(item.amount), item.received_time.match(/\d/g).join(""), 1, item.received_time],
// 														async () => {
// 															db.query(
// 																"SELECT * FROM setting WHERE type = ?",
// 																["mini_game"],
// 																async (error, setting) => {
// 																	if (error) throw error;
// 																	const data = await JSON.parse(setting[0].data);
// 																	if (parseInt(item.amount) >= parseInt(data.amount)) {
// 																		db.query(
// 																			"UPDATE users SET quantity = quantity + ?, WHERE username = ?",
// 																			[1, user.username],
// 																		);
// 																		await axios.post(`${process.env.SERVER_URL}/notify`,
// 																			{
// 																				username: user.username,
// 																				amount: parseFloat(item.amount).toFixed(2),
// 																			}
// 																		);
// 																	}
// 																}
// 															);
// 														});
// 												});
// 											}
// 										}
// 									}
// 								});
// 							});
// 						}
// 					});
// 				});
// 			});
// 		});
// 	} catch (error) {
// 		console.log(error);
// 	}
// });

export default TransferController;