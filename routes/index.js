import express from "express";
import {
  updateUser,
  getUsers,
  Register,
  Login,
  Logout,
} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.post("/users", Register);
router.post("/login", Login);
router.get("/users/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  return getUsers(user_id, res);
});

router.put("/users", updateUser);

router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
