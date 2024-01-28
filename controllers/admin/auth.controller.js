import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import db from "../../config/database.js";

const AuthController = {
    //ฟังก์ชันลงทะเบียน
    Signup: async (req, res) => {
        try {
            db.query(
                "SELECT * FROM admin",
                (error, results) => {
                    if (error) throw error;
                    if (results.length > 0) {
                        return res.send({ status: "error", message: "มีผู้ดูแลระบบแล้ว!" });
                    }
                    // Assuming 'creator' is a required field, provide a value for it in the INSERT query
                    db.query(
                        "INSERT INTO admin (username, password, role, creator) VALUES (?, ?, ?, ?)",
                        [req.body.username, bcrypt.hashSync(req.body.password, 10), "admin", "some_creator_value"],
                        (error, _) => {
                            if (error) throw error;
                            return res.send({ status: "success", message: "ลงทะเบียนสำเร็จ!" });
                        },
                    );
                });

        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชันเข้าสู่ระบบ
    Signin: async (req, res) => {
        try {
            db.query(
                "SELECT * FROM admin WHERE username = ?",
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
                            username: results[0].username
                        },
                        process.env.ADMIN_SECRET_KEY,
                        { expiresIn: "1d" },
                    );
                    const data = {
                        ip: req.body.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
                        agent: req.headers["user-agent"],
                    };
                    db.query(
                        "INSERT INTO logs (username, type, data) VALUES (?, ?, ?)",
                        [results[0].username, "login", JSON.stringify(data)],
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

    //ฟังก์ชันเช็ค token ของ admin
    AdminToken: async (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
            if (decoded) {
                return res.send({ username: decoded.username, exp: decoded.exp });
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export default AuthController;
