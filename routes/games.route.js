import { Router } from "express";
const router = Router();
import UserMiddleware from "../middlewares/user.middleware.js";

// Import controllers
import GamesController from "../controllers/games.controller.js";

// Endpoint http://localhost:5000/api/v1/games/setting
// Method POST
// Access Private
router.post("/games/setting", GamesController.GamesSetting);

// Endpoint http://localhost:5000/api/v1/games/limitbet
// Method POST
// Access Private
router.post("/games/limitbet", GamesController.LimitBet);

// Endpoint http://localhost:5000/api/v1/games/limitbet/setting
// Method POST
// Access Private
router.post("/games/limitbet/setting", GamesController.LimitBetSetting);

// Endpoint http://localhost:5000/api/v1/games/limitbet/multisetting
// Method POST
// Access Private
router.post(
	"/games/limitbet/multisetting",
	GamesController.LimitMultiBetSetting,
);

// Endpoint http://localhost:5000/api/v1/games/limitbet/sport/setting
// Method POST
// Access Private
router.post("/games/limitbet/sport/setting", GamesController.SetSportLimitBet);

// Endpoint http://localhost:5000/api/v1/games/play/login/lobby
// Method POST
// Access Private
router.post(
	"/games/play/login/lobby",
	UserMiddleware.checkToken,
	GamesController.PlayLoginLobby,
);

// PlayLoginGame
// Endpoint http://localhost:5000/api/v1/games/play/login
// Method POST
// Access Private
router.post(
	"/games/play/login",
	UserMiddleware.checkToken,
	GamesController.PlayLoginGame,
);

// Endpoint http://localhost:5000/api/v1/games/list
// Method GET
// Access public
router.get("/games/list", UserMiddleware.checkToken, GamesController.ListGames);

// Endpoint http://localhost:5000/api/v1/games/provider/list
// Method POST
// Access public
router.post(
	"/games/provider/list",
	UserMiddleware.checkToken,
	GamesController.ListGamesProvider,
);

// MiniGame
// Endpoint http://localhost:5000/api/v1/games/minigame/play
// Method POST
// Access Private
router.post(
	"/games/minigame/play",
	UserMiddleware.checkToken,
	GamesController.MiniGamePlay,
);

export default router;
