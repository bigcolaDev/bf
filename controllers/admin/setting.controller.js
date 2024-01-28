import db from "../../config/database.js";
// import { io } from "../../server.js";

const SettingController = {
    // ฟังก์ชันเรียกข้อมูล การตั้งค่า
    Setting: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    if (result.length > 0) {
                        
                        if (req.body.type === "mini_game") {
                            const data = JSON.parse(result[0].data);
                            delete data.itemReward;
                            res.send({ status: "success", data: data });
                        } else {
                            res.send({ status: "success", data: JSON.parse(result[0].data) });
                        }
                    } else {
                        res.send({ status: "success", data: "" });
                    }
                });
        } catch (error) {
            console.log(error);
        }
    },

    // ฟังก์ชัน สร้าง การตั้งค่า โลโก้
    CreateLogo: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        logo: req.body.logo,
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

    // ฟังก์ชัน สร้าง การตั้งค่า ทางเข้าเกมส์
    CreatePlayGame: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        playgame: req.body.playgame
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

    // ฟังก์ชัน สร้าง การตั้งค่า ช่องทางติดต่อ
    CreateContact: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        contact: req.body.contact
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

    // ฟังก์ชัน สร้าง การตั้งค่า notify
    CreateNotify: async (req, res) => { 
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        title : req.body.title,
                        notify: req.body.notify
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

    // ฟังก์ชัน สร้าง ขีดจำกัด ฝาก-ถอน
    CreateLimitDepositAndWithdraw: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        min: req.body.min,
                        max: req.body.max,
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

    // ฟังก์ชัน สร้าง การตั้งค่า ระบบแนะนำเพื่อน
    CreateSettingReferral: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        level1: req.body.level1,
                        level2: req.body.level2,
                        withdraw: req.body.withdraw,
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

    // ฟังก์ชัน สร้าง การตั้งค่า มินิเกมส์
    CreateSettingMiniGame: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        name: req.body.name,
                        image: req.body.image,
                        item1: req.body.item1,
                        item2: req.body.item2,
                        item3: req.body.item3,
                        item4: req.body.item4,
                        item5: req.body.item5,
                        item6: req.body.item6,
                        item7: req.body.item7,
                        item8: req.body.item8,
                        item9: req.body.item9,
                        itemReward: req.body.itemReward.includes(",") ? req.body.itemReward.split(",") : [req.body.itemReward],
                        amount : req.body.amount,
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

    // ฟังก์ชัน สร้าง การตั้งค่า commission
    CreateSettingCommission: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        percent: req.body.percent,
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

    // ฟังก์ชัน สร้าง การตั้งค่า cashback
    CreateSettingCashback: async (req, res) => {
        try {
            db.query(
                `SELECT * FROM setting WHERE type = ?`,
                [req.body.type],
                (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    const data = {
                        percent: req.body.percent,
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
    }

};

export default SettingController;
