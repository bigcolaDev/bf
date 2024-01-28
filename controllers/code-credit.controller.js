import axios from "axios";
import qs from "qs";
import db from "../config/database.js";

const CodeController = {
    //ฟังก์ชั่นสร้างโค้ด
    Create: async (req, res) => {
        try {
            for (let i = 0; i < req.body.digit; i++) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                const code = () => {
                    let result = '';
                    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const charactersLength = characters.length;
                    for (let i = 0; i < 30; i++) {
                        if (i % 6 === 0 && i !== 0) {
                            result += '-';
                        }
                        result += characters.charAt(Math.floor(Math.random() * charactersLength)); 
                    }
                    return result;
                };

                db.query(
                    "INSERT INTO code (code, credit, turn, max_withdraw) VALUES (?, ?, ?, ?)",
                    [code(), req.body.credit, req.body.turn, req.body.max_withdraw],
                );

                if (i === req.body.digit - 1) {
                    res.send({ status: "success", message: "สร้างโค้ดสำเร็จ." });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชั่นเรียกดูรายการโค้ด
    List: async (req, res) => {
        try {
            db.query(
                "SELECT * FROM code",
                (error, results) => {
                    if (error) throw error;
                    res.send({ status: "success", data: results });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชั่นเครียร์โค้ด
    Clear: async (req, res) => {
        try {
            db.query(
                "DELETE FROM code",
                (error, _) => {
                    if (error) throw error;
                    res.send({ status: "success", message: "ล้างโค้ดเรียบร้อยแล้ว." });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชั่นเช็คโค้ด
    Check: async (req, res) => {
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
            await axios(config)
                .then((response) => {
                    db.query(
                        "SELECT * FROM users WHERE username = ?",
                        [req.body.username],
                        (error, user) => {
                            if (error) throw error;
                            if (user.length > 0) {
                                if (user[0].turn_status === 1 && user[0].promotion === 1) {
                                    return res.send({ status: "error", message: "โปรโมชั่นของคุณถูกเปิดใช้งานแล้ว!" });
                                }
                                const creditfreeLimit = 0;
                                if (parseInt(response.data.data.balance) > creditfreeLimit) {
                                    return res.send({ status: "error", message: `เครดิตปัจจุบันต้องไม่มากกว่า ${creditfreeLimit} บาท!` });
                                }
                                db.query(
                                    "SELECT * FROM code WHERE code = ? AND status = 0",
                                    [req.body.code],
                                    async (error, results) => {
                                        if (error) throw error;
                                        if (results.length > 0) {
                                            const code = Math.floor(1000000000 + Math.random() * 9000000000);
                                            const data = qs.stringify({
                                                username: `${process.env.UPLINE}${req.body.username.substring(2)}`,
                                                amount: results[0].credit,
                                                ref: `credit-free${code}`
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
                                            db.query(
                                                "UPDATE users SET turn_status = ?, promotion = ?, promotionType = ?, description = ?, turn_value = ?, turnoverA = ?, turnoverB = ?, turn_withdraw = ? WHERE username = ?",
                                                [1, "เครดิตฟรี", 1, `เครดิตฟรี ฿${results[0].credit} / เทิร์น ฿${results[0].turn} / ถอนได้ ฿${results[0].max_withdraw}`, response.data.data.balance + results[0].credit, results[0].turn, 0.00, results[0].max_withdraw, req.body.username],
                                                async (error, _) => {
                                                    if (error) throw error;
                                                    await axios(config).then(() => {
                                                        db.query(
                                                            "UPDATE code SET status = 1 WHERE id = ?",
                                                            [results[0].id],
                                                            (error, _) => {
                                                                if (error) throw error;
                                                                const data = {
                                                                    username: req.body.username,
                                                                    credit: results[0].credit,
                                                                };
                                                                db.query(
                                                                    "INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
                                                                    [req.body.username, "credit-free", JSON.stringify(data)],
                                                                    async (error, _) => {
                                                                        if (error) throw error;
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
                                                                        await axios.post(
                                                                            `${process.env.SERVER_URL}/users/current`,
                                                                            {
                                                                                username: req.body.username,
                                                                            },
                                                                            {
                                                                                headers: {
                                                                                    Authorization: `${req.headers.authorization}`,
                                                                                },
                                                                            }
                                                                        );
                                                                        res.send({ status: "success", message: "เติมเครดิตเรียบร้อยแล้ว." });
                                                                    }
                                                                );
                                                            },
                                                        );
                                                    });
                                                },
                                            );
                                        } else {
                                            res.send({ status: "error", message: "โค้ดไม่ถูกต้อง!" });
                                        }
                                    },
                                );
                            }
                        },
                    );
                });
        } catch (error) {
            console.log(error);
        }
    }
};

export default CodeController;