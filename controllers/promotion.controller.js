import db from "../config/database.js";
import qs from "qs";
import cron from "node-cron";
import axios from "axios";

const PromotionController = {
    //ฟังก์ชันสำหรับเพิ่มข้อมูลโปรโมชั่น
    Create: async (req, res) => {
        try {
            const { promotions } = req.body;
            db.query(
                `INSERT INTO promotion (title, img, type, happyTime, withdraw, deposit, depositType, bonus, bonusType, maxBonus, maxBonusType, turnover, turnoverType, maxWithdraw) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ?)`,
                [
                    promotions.title,
                    promotions.img,
                    promotions.type,
                    promotions.happyTime,
                    promotions.withdraw,
                    promotions.deposit,
                    promotions.depositType,
                    promotions.bonus,
                    promotions.bonusType,
                    promotions.maxBonus,
                    promotions.maxBonusType,
                    promotions.turnover,
                    promotions.turnoverType,
                    promotions.maxWithdraw
                ],
                (error) => {
                    if (error) throw error;
                    res.send({
                        status: "success",
                        message: "เพิ่มโปรโมชั่นเรียบร้อย.",
                    });
                }
            );
        }
        catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชันเรียกข้อมูลโปรโมชั่นทั้งหมด
    GetAll: async (req, res) => {
        try {
            db.query(`SELECT * FROM promotion`, (error, results) => {
                if (error) throw error;
                res.send({ status: "success", data: results });
            });
        }
        catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชันตั้งค่าการฝากเงินโปรโมชั่น
    DepositProCount: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        amount: req.body.amount
                    };
                    if (result.length === 0) {
                        db.query(
                            `INSERT INTO setting (type, data) VALUES (?, ?)`,
                            [req.body.type, JSON.stringify(data)],
                            (err, _) => {
                                if (err) {
                                    console.log(err);
                                }
                                res.send({ status: "success", message: "บันทึกข้อมูลเรียบร้อย." });
                            }
                        );
                    } else {
                        db.query(
                            `UPDATE setting SET data = ? WHERE type = ?`,
                            [JSON.stringify(data), req.body.type],
                            (err, _) => {
                                if (err) {
                                    console.log(err);
                                }
                                res.send({ status: "success", message: "บันทึกข้อมูลเรียบร้อย." });
                            }
                        );

                    }
                });
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชันลบโปรโมชั่น
    Delete: async (req, res) => {
        try {
            db.query(
                `DELETE FROM promotion WHERE id = ?`,
                [req.body.id],
                (error) => {
                    if (error) throw error;
                    res.send({
                        status: "success",
                        message: "ลบโปรโมชั่นเรียบร้อย.",
                    });
                }
            );
        }
        catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชันแก้ไขโปรโมชั่น
    Update: async (req, res) => {
        try {
            const { promotions } = req.body;
            db.query(
                `UPDATE promotion SET title = ?, img = ?, type = ?, withdraw = ?, deposit = ?, depositType = ?, bonus = ?, bonusType = ?, maxBonus = ?, maxBonusType = ?, turnover = ?, turnoverType = ?, maxWithdraw = ?, status = ? WHERE id = ?`,
                [
                    promotions.title,
                    promotions.img,
                    promotions.type,
                    promotions.withdraw,
                    promotions.deposit,
                    promotions.depositType,
                    promotions.bonus,
                    promotions.bonusType,
                    promotions.maxBonus,
                    promotions.maxBonusType,
                    promotions.turnover,
                    promotions.turnoverType,
                    promotions.maxWithdraw,
                    promotions.status,
                    req.body.id
                ],
                (error) => {
                    if (error) throw error;
                    res.send({
                        status: "success",
                        message: "แก้ไขโปรโมชั่นเรียบร้อย.",
                    });
                }
            );
        }
        catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชันรับโปรโมชั่นของยูสเซอร์
    CreatePromotionWithUser: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM users WHERE username = ?`,
                [req.body.user.username],
                (err, user) => {
                    if (err) {
                        return console.log(err);
                    }
                    if (user.length === 0) {
                        res.send({ status: "error", message: "ไม่พบข้อมูลผู้ใช้งาน." });
                    } else {
                        if(user[0].promotion === 1){ 
                            return res.send({ status: "error", message: "คุณได้รับโปรโมชั่นไปแล้ว!" });
                        }
                        const { promotions } = req.body;
                        if (promotions.type === "ปกติ") {
                            db.query(
                                `UPDATE users SET promotion = 1, description = ?, promotionType = ?, withdrawal = ?, deposit = ?, depositType = ?, bonus = ?, bonusType = ?, maxBonus = ?, maxBonusType = ?, turnover = ?, turnoverType = ?, maxWithdraw = ?, turnoverB = ?. turn_status = ? WHERE username = ?`,
                                [
                                    promotions.title,
                                    promotions.type,
                                    promotions.withdraw,
                                    promotions.deposit,
                                    promotions.depositType,
                                    promotions.bonus,
                                    promotions.bonusType,
                                    promotions.maxBonus,
                                    promotions.maxBonusType,
                                    promotions.turnover,
                                    promotions.turnoverType,
                                    promotions.maxWithdraw,
                                    promotions.turnover,
                                    1,
                                    req.body.user.username
                                ],
                                (error) => {
                                    if (error) throw error;
                                    res.send({
                                        status: "success",
                                        message: "รับโปรโมชั่นเรียบร้อย.",
                                    });
                                }
                            );
                        } else {
                            if (promotions.type === "สมาชิกใหม่") {
                                if (user[0].new !== 1) {
                                    return res.send({ status: "error", message: "โปรโมชั่นนี้สำหรับสมาชิกใหม่เท่านั้น." });
                                } else {
                                    db.query(
                                        `UPDATE users SET promotion = 1, description = ?, promotionType = ?, withdrawal = ?, deposit = ?, depositType = ?, bonus = ?, bonusType = ?, maxBonus = ?, maxBonusType = ?, turnover = ?, turnoverType = ?, maxWithdraw = ?, new = 0, turnoverB = ?, turn_status = ? WHERE username = ?`,
                                        [
                                            promotions.title,
                                            promotions.type,
                                            promotions.withdraw,
                                            promotions.deposit,
                                            promotions.depositType,
                                            promotions.bonus,
                                            promotions.bonusType,
                                            promotions.maxBonus,
                                            promotions.maxBonusType,
                                            promotions.turnover,
                                            promotions.turnoverType,
                                            promotions.maxWithdraw,
                                            promotions.turnover,
                                            1,
                                            req.body.user.username
                                        ],
                                        (error) => {
                                            if (error) throw error;
                                            res.send({
                                                status: "success",
                                                message: "รับโปรโมชั่นเรียบร้อย.",
                                            });
                                        }
                                    );
                                }
                            } else if (promotions.type === "โปรวันใหม่") {
                                if (user[0].onceDay !== 0) {
                                    return res.send({ status: "error", message: "โปรโมชั่นนี้รับได้แค่วันล่ะครั้ง!" });
                                } else {
                                    db.query(
                                        `UPDATE users SET promotion = 1, description = ?, promotionType = ?, withdrawal = ?, deposit = ?, depositType = ?, bonus = ?, bonusType = ?, maxBonus = ?, maxBonusType = ?, turnover = ?, turnoverType = ?, maxWithdraw = ?, onceDay = 0, turnoverB = ?, turn_status = ? WHERE username = ?`,
                                        [
                                            promotions.title,
                                            promotions.type,
                                            promotions.withdraw,
                                            promotions.deposit,
                                            promotions.depositType,
                                            promotions.bonus, 
                                            promotions.bonusType,
                                            promotions.maxBonus,
                                            promotions.maxBonusType,
                                            promotions.turnover,
                                            promotions.turnoverType,
                                            promotions.maxWithdraw,
                                            promotions.turnover,
                                            1,
                                            req.body.user.username
                                        ],
                                        (error) => {
                                            if (error) throw error;
                                            res.send({
                                                status: "success",
                                                message: "รับโปรโมชั่นเรียบร้อย.",
                                            });
                                        }
                                    );
                                }
                            } else if (promotions.type === "Happy Time") {
                                const today = new Date();
                                const endDate = new Date(promotions.happyTime);
                                if (today < endDate) {
                                    return res.send({ status: "error", message: "โปรโมชั่นนี้หมดอายุแล้ว!" });
                                } else {
                                    db.query(
                                        `UPDATE users SET promotion = 1, description = ?, promotionType = ?, withdrawal = ?, deposit = ?, depositType = ?, bonus = ?, bonusType = ?, maxBonus = ?, maxBonusType = ?, turnover = ?, turnoverType = ?, maxWithdraw = ?, turnoverB = ?, turn_status = ? WHERE username = ?`,
                                        [
                                            promotions.title,
                                            promotions.type,
                                            promotions.withdraw,
                                            promotions.deposit,
                                            promotions.depositType,
                                            promotions.bonus,
                                            promotions.bonusType,
                                            promotions.maxBonus,
                                            promotions.maxBonusType,
                                            promotions.turnover,
                                            promotions.turnoverType,
                                            promotions.maxWithdraw,
                                            promotions.turnover,
                                            1,
                                            req.body.user.username
                                        ],
                                        (error) => {
                                            if (error) throw error;
                                            res.send({
                                                status: "success",
                                                message: "รับโปรโมชั่นเรียบร้อย.",
                                            });
                                        }
                                    );
                                }
                            }
                        }
                    }
                });
        }
        catch (error) {
            console.log(error);
        }
    },

};

// ฟังก์ชันอัพเดทเทิร์นโอเวอร์ ทุกๆ 3 วินาที
cron.schedule("*/3 * * * * *", async () => {
	try {
		db.query(
			"SELECT * FROM users", async (error, users) => {
				if (error) throw error;
				for (const user of users) {
					if (user.turn_status === 1) {
						const data = qs.stringify({
							username: `${process.env.UPLINE}${user.username.substring(2)}`,
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
							db.query(
								"UPDATE users SET turnoverB = ? WHERE username = ?",
								[response.data.data.balance - user.turn_value + user.turn_value, user.username],
							);

							if (user.turnoverB >= user.turnoverA) {
								db.query(
									"UPDATE users SET turn_status = ?, turn_value = ?, turnoverA = ?, turnoverB = ? WHERE username = ?",
									[0, 0.00, 0.00, 0.00, user.username],
								);
							}
						});

					}
				}
			}
		);
	} catch (error) {
		console.log(error);
	}
});

cron.schedule("0 0 * * *", async () => {
	try {
		db.query("UPDATE users SET promotion = ?, description = ?, promotionType = ?, onceDay = ?, withdrawal = ?, deposit = ?, depositType = ?, bonus = ?, bonusType = ?, maxBonus = ?, maxBonusType = ?, turnover = ?, turnoverType = ?, maxWithdraw = ?, running = ?, turn_value = ?, turnoverA = ?, turnoverB = ?, turn_withdraw = ?, turn_status = ?",
			[0, "", "", 0, "", 0.00, "", 0.00, "", 0.00, "", 0.00, "", 0.00, 0, 0.00, 0.00, 0.00, 0.00, 0],
		);
	} catch (error) {
		console.log(error);
	}
});

export default PromotionController;