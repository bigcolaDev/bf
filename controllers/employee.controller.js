import bcrypt from "bcryptjs";
import db from "../config/database.js";

const EmployeeController = {
    //ฟังก์ชัน สร้างข้อมูลพนักงาน
    Create: async (req, res) => {
        try {
            db.query(
                "SELECT * FROM admin",
                (error, results) => {
                    for (const employee of results) {
                        if (req.body.username === employee.username) {
                            return res.send({ status: "error", message: "ชื่อผู้ใช้ซ้ำกัน!" });
                        }
                    }
                    if (error) throw error;
                    db.query(
                        "INSERT INTO admin (username, password, role, creator) VALUES (?, ?, ?, ?)",
                        [req.body.username, bcrypt.hashSync(req.body.password, 8), req.body.role, req.body.creator],
                        (error, _) => {
                            if (error) throw error;
                            return res.send({ status: "success", message: "สร้างข้อมูลพนักงานสำเร็จ!" });
                        },
                    );
                });

        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชัน แสดงข้อมูลพนักงานทั้งหมด
    Employees: async (req, res) => {
        try {
            db.query(
                "SELECT * FROM admin",
                (error, results) => {
                    if (error) throw error;
                    return res.send({ status: "success", data: results });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชัน ลบข้อมูลพนักงาน
    Delete: async (req, res) => {
        try {
            db.query(
                "DELETE FROM admin WHERE username = ?",
                [req.body.username],
                (error, _) => {
                    if (error) throw error;
                    return res.send({ status: "success", message: "ลบข้อมูลพนักงานสำเร็จ!" });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชัน แก้ไขสถานะพนักงาน
    UpdateStatus: async (req, res) => {
        try {
            db.query(
                "UPDATE admin SET status = ? WHERE username = ?",
                [req.body.status, req.body.username],
                (error, _) => {
                    if (error) throw error;
                    return res.send({ status: "success", message: "แก้ไขสถานะสำเร็จ!" });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชัน แก้ไขข้อมูลพนักงาน
    Update: async (req, res) => {
        try {
            db.query(
                "UPDATE admin SET username = ?, role = ? WHERE id = ?",
                [req.body.username, req.body.role, req.body.id],
                (error, _) => {
                    if (error) throw error;
                    return res.send({ status: "success", message: "แก้ไขข้อมูลพนักงานสำเร็จ!" });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },
};

export default EmployeeController; 