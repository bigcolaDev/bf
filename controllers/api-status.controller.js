import axios from "axios";

const Status = {
    //ฟังก์ชันเช็คสถานะ API
    ApiStatus: async (req, res) => {
        try {
            const config = {
                method: "GET",
                maxBodyLength: Infinity,
                url: `${process.env.API_URL}/v4/status`,
                headers: {
                    "x-api-cat": process.env.API_CAT,
                    "x-api-key": process.env.API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            };

            await axios(config)
                .then((response) => {
                    res.send(response.data);
                });
        } catch (error) {
            console.log(error);
        }
    },
};

export default Status;