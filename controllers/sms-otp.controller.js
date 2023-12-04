import axios from "axios";

const SmsOtpController = {
	Send: async (req, res) => {
		try {
			const randomString = Math.random().toString(36).substring(2, 8);
			const data = JSON.stringify({
				recipient: req.body.tel,
				sender_name: process.env.SENDER_NAME,
				ref_code: randomString.toUpperCase(),
				digit: process.env.DIGITS,
				validity: process.env.VALIDITY,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.SMS_API_URL}/sms-api/otp-sms/send`,
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${process.env.TOKEN}`,
					"Content-Type": "application/json",
				},
				data: data,
			};

			await axios(config)
				.then((response) => {
					res.send({
						status: response.data.status,
						token: response.data.data.token,
						ref_code: randomString.toUpperCase(),
						validity: process.env.VALIDITY,
					});
				})
				.catch((error) => {
					res.send({ error });
				});
		} catch (error) {
			console.log(error);
		}
	},
	Verify: async (req, res) => {
		try {
			const data = JSON.stringify({
				token: req.body.token,
				otp_code: req.body.otp_code,
				ref_code: req.body.ref_code,
			});

			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: `${process.env.SMS_API_URL}/sms-api/otp-sms/verify`, 
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${process.env.TOKEN}`,
					"Content-Type": "application/json",
				},
				data: data,
			};

			await axios(config)
				.then((response) => {
					res.send(response.data);
				})
				.catch((error) => {
					res.send({ error });
				});
		} catch (error) {
			console.log(error);
		}
	},
};

export default SmsOtpController;
