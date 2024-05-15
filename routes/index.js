import express from "express";
import axios from "axios";
import { getUsers, Register, Login, deleteUser } from "../controllers/Users.js";
import { getGoogleAuth, getGoogleRefreshToken } from "../controllers/Auth.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.post("/api/signup", Register);
router.post("/api/signin", Login);
router.post("/api/auth/google", getGoogleAuth);
router.post("/api/auth/google/refresh-token", getGoogleRefreshToken);
router.get("/api/users/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  return getUsers(user_id, res);
});

router.put("/api/delete", deleteUser);
router.post("/api/verify-token", async (req, res) => {
  const { reCAPTCHA_TOKEN, Secret_Key } = req.body;
  try {
    let response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${Secret_Key}&response=${reCAPTCHA_TOKEN}`
    );
    return res.status(200).json({
      success: true,
      message: "Token successfully verified",
      verification_info: response.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error verifying token",
    });
  }
});

// router.get("/token", refreshToken);
// router.delete("/logout", Logout);

export default router;
