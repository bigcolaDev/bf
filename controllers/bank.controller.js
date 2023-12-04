import db from "../config/database.js";
import axios from "axios";

const BankController = {
    //ฟังก์ชันข้อมูล transaction bank scb
    GetTransactionBankScb: async (req, res) => {
        try {
            const response = await axios.get(
                "http://122.248.204.147:8080/scb-api",
            );
            const bankName = "ไทยพาณิชย์";
            res.send({ status: "success", data: response.data, bankName });
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชันข้อมูล transaction true wallet
    GetTransactionTopup: async (req, res) => {
        try {
            const response = await axios.get(
                "http://122.248.204.147:3003",
            );
            res.send({ status: "success", data: response.data });
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชันข้อมูลผูธุรกรรม ของผู้ดูแลระบบ
    GetAccountBank: async (req, res) => {
        try {
            db.query(
                "SELECT * FROM banks",
                (error, data) => {
                    if (error) throw error;
                    res.send({ status: "success", data });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชัน เพิ่ม บัญชีธนาคาร
    AddAccountBank: async (req, res) => {
        try {
            db.query(
                "INSERT INTO banks (type, name, bankName, bankNumber, bankCode, deviceid, pin) VALUES (?,?,?,?,?,?,?)",  
                [
                    req.body.type,
                    req.body.name,
                    req.body.bankName,
                    req.body.bankNumber,
                    req.body.bankCode,
                    req.body.deviceid,
                    req.body.pin,
                ],
                (error) => {
                    if (error) throw error;
                    res.send({
                        status: "success",
                        message: "เพิ่มบัญชีธนาคารเรียบร้อย.",
                    });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชัน แก้ไข สถานะ บัญชีธนาคาร
    UpdateStatusAccountBank: async (req, res) => {
        try {
            db.query(
                "UPDATE banks SET status = ? WHERE id = ?",
                [req.body.status, req.body.id],
                (error) => {
                    if (error) throw error;
                    res.send({
                        status: "success",
                        message: "แก้ไขสถานะบัญชีธนาคารเรียบร้อย.",
                    });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชัน แก้ไข บัญชีธนาคาร
    UpdateAccountBank: async (req, res) => {
        try {
            db.query(
                "UPDATE banks SET type = ?, name = ?, bankName = ?, bankNumber = ?, bankCode = ?, deviceid = ?, pin = ? WHERE id = ?",
                [
                    req.body.type,
                    req.body.name,
                    req.body.bankName,
                    req.body.bankNumber,
                    req.body.bankCode,
                    req.body.deviceid,
                    req.body.pin,
                    req.body.id,
                ],
                (error) => {
                    if (error) throw error;
                    res.send({
                        status: "success",
                        message: "แก้ไขบัญชีธนาคารเรียบร้อย.", 
                    });
                },
            );
        } catch (error) {
            console.log(error);
        }
    },

    //ฟังก์ชัน ลบ บัญชีธนาคาร
    DeleteAccountBank: async (req, res) => {
        try {
            db.query(
                "DELETE FROM banks WHERE id = ?",
                [req.body.id],
                (error) => {
                    if (error) throw error;
                    res.send({
                        status: "success",
                        message: "ลบบัญชีธนาคารเรียบร้อย.",
                    });
                },
            );
        } catch (error) {
            console.log(error);
        }
    }

};

export default BankController;
