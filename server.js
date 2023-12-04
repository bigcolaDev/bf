import express from "express";
import { Server } from "socket.io";
import { createServer } from 'http';
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
export const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
	},
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cors());

//Routes (Dynamic import)
fs.readdirSync("./routes").map((route) => {
	import(`./routes/${route}`).then((routeFile) => {
		app.use("/api/v1", routeFile.default);
	});
});

app.post("/notify", (req, res) => {
	io.emit("server:notify", { status: "success", username: req.body.username, amount: req.body.amount });
	res.send({ status: "success" });
});

// Server
server.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
