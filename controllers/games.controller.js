import axios from "axios";
import qs from "qs";
import db from "../config/database.js";

const GamesController = {
	//ฟังก์ชัน เปิด-ปิดเกมส์
	GamesSetting: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
				games: req.body.games,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/gameSetting`,
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

	//ฟังก์ชัน เรียกดูจำกัดการแทงปัจจุบันของผู้เล่น
	LimitBet: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/limitBet`,
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

	//ฟังก์ชัน ตั้งค่าจำกัดการแทง
	LimitBetSetting: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
				game: req.body.game,
				limit: req.body.limit,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/setLimitBet`,
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

	//ฟังก์ชัน ตั้งค่าจำกัดการแทง แบบหลายเกมส์
	LimitMultiBetSetting: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
				limits: req.body.limits,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/setLimitsBet`,
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

	//ฟังก์ชัน ตั้งค่าจำกัดการแทงกีฬา
	SetSportLimitBet: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
				min: req.body.min, //แทงบอลขั้นต่ำ
				max: req.body.max, //แทงบอลสูงสุด
				maxPerMatch: req.body.maxPerMatch, //แทงบอลสูงสุดต่อแมทช์
				parmin: req.body.parmin, //แทงพาร์เลย์ขั้นต่ำ
				parmax: req.body.parmax, //แทงพาร์เลย์สูงสุด
				parmaxLimit: req.body.parmaxLimit, //แทงพาเลย์บอลสูงสุดต่อ 1 บิล
				sportmaxcount: req.body.sportmaxcount, //จำนวนบิลบอลสูงสุด
				othersportmin: req.body.othersportmin, //แทงกีฬาอื่นขั้นต่ำ
				othersportmax: req.body.othersportmax, //แทงกีฬาอื่นสูงสุด
				othersportmaxLimit: req.body.othersportmaxLimit, //แทงกีฬาอื่นสูงสุดต่อแมทซ์
				othersportmaxcount: req.body.othersportmaxcount, //จำนวนบิลกีฬาอื่นสูงสุด
				comHdpOuOe: req.body.comHdpOuOe, //คอมมิชชั่นประเภท HDP, OU, OE (0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1)
				com1x2Outright: req.body.com1x2Outright, ///คอมมิชชั่นประเภทอื่นๆ (0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1)
				comMixparlay: req.body.comMixparlay, //คอมมิชชั่นประเภทพาเลย์ (0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1)
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/user/setSportLimitBet`,
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

	//ฟังก์ชัน เข้าเล่นผ่านล็อบบี้
	PlayLoginLobby: async (req, res) => {
		try {
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/play/login`,
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

	//ฟังก์ชัน เข้าเล่นเกมส์โดยตรง
	PlayLoginGame: async (req, res) => {
		try {
			console.log(req.body);
			const data = qs.stringify({
				username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
				provider: req.body.provider,
				gamecode: req.body.gamecode,
				language: req.body.language,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.API_URL}/v4/play/login`,
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

	//ฟังก์ชัน List เกมส์
	ListGames: async (req, res) => {
		try {
			const config = {
				method: "GET",
				url: "https://www.083510.com/games_share/list.txt",
			};

			await axios(config)
				.then((response) => {
					res.send(response.data);
				});
		} catch (error) {
			console.log(error);
		}
	},

	//ฟังก์ชัน list เกมส์ provider
	ListGamesProvider: async (req, res) => {
		try {
			const config = {
				method: "GET",
				url: `https://www.083510.com/games_share/${req.body.provider}.txt`,
			};

			await axios(config)
				.then((response) => {
					res.send(response.data);
				});
		} catch (error) {
			console.log(error);
		}
	},

	MiniGamePlay: async (req, res) => {
		try {
			db.query(
				`SELECT quantity FROM users WHERE username = '${req.body.username}'`,
				async (_, result) => {
					const quantity = result[0].quantity;
					if (quantity < 1) {
						return res.send({ status: "error", message: "คุณไม่มีสิทธิ์เล่นกิจกรรม!" });
					}
					db.query(
						`UPDATE users SET quantity = quantity - 1 WHERE username = '${req.body.username}'`,
						async () => {
							db.query(
								"SELECT * FROM setting WHERE type = ?",
								["mini_game"],
								async (error, result) => {
									if (error) throw error;
									const setting = JSON.parse(result[0].data);
									let reward = "";
									const items = setting.itemReward;
									const randomItem = items[Math.floor(Math.random() * items.length)];
									reward = randomItem;
									const code = Math.floor(1000000000 + Math.random() * 9000000000);
									const data = qs.stringify({
										username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
										amount: reward,
										ref: `minigame${code}`
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
											title: "เกมส์สุ่มอังเปา",
											amount: parseFloat(reward),
											ref: `minigame${code}`
										};
										db.query(
											"INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
											[req.body.username, "minigame", JSON.stringify(data)],
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

												await axios.get(
													`${process.env.SERVER_URL}/api/v1/users/logs/all`,
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
											}
										);
									});
									res.send({ reward });

								});
						});
				}
			);
		} catch (error) {
			console.log(error);
		}
	},
};

export default GamesController;
