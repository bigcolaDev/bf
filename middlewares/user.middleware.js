import jwt from "jsonwebtoken";

const UserMiddleware = {
	//ฟังก์ชันตรวจสอบ Token
	checkToken: (req, res, next) => {
		let token = req.headers["authorization"];
		if (token) {
			token = token.split(" ")[1];
			jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
				if (err) {
					return res.send({
						status: "error",
						message: "invalid token!",
					});
				}
				req.decoded = decoded;
				next();
			});
		} else {
			return res.send({
				status: "error",
				message: "invalid token!",
			});
		}
	},
};

export default UserMiddleware;
