import db from "../../config/database.js";
import { io } from "../../server.js";

const AdminController = {
    //ฟังก์ชัน current admin
    CurrentAdmin: async (req, res) => {
        try {
            db.query(
                "SELECT * FROM admin WHERE username = ?",
                [req.body.username],
                (error, results) => {
                    if (error) throw error;
                    if (results.length > 0) {
                        delete results[0].password;
                        io.emit("server:current_admin", results[0]);
                        res.send({ status: "success", results });
                    }
                },
            );
        } catch (error) {
            console.log(error);
        }
    }

};

export default AdminController;
