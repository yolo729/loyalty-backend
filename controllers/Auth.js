import { OAuth2Client } from "google-auth-library";
import Users from "../models/UserModel.js";
import axios from "axios";

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);
export const getGoogleAuth = async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  try {
    let response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`
    );
    const { email, given_name, family_name } = await response.data;

    const user = await Users.findOne({
      where: {
        email: response.data.email,
      },
    });

    if (!user) {
      await Users.create({
        firstName: given_name,
        lastName: family_name,
        email: email,
        signOption: 1,
      });
    } else if (user.signOption === 0) {
      console.log("alert");
    } else console.log(user.signOption, "fffff");
    return;

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Error",
      });
    }

    // if (user && user.signOption == 1) {
    //   res.json({ user });
    // } else {
    //   if (user.signOption == 0) {
    //     return res.status(500).json({
    //       success: false,
    //       message: "Error",
    //     });
    //   }

    // }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying token",
    });
  }
};
export const getGoogleRefreshToken = async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
};
