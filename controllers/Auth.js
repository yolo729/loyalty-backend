import { OAuth2Client } from "google-auth-library";
import Users from "../models/UserModel.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { addZinreloMember, createZinreloToken } from "./Users.js";

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);
export const signinGoogle = async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`
    );
    const { email, given_name, family_name } = response.data;

    const user = await Users.findOne({
      where: {
        email: response.data.email,
      },
    });

    if (!user) {
      console.log(
        "continue with Google: No user registered with google account"
      );
      return res
        .status(500)
        .json({ msg: "There is no user registered with google" });
    } else {
      if (user.signOption === 1 && user.google_id) {
        const payload = {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          zinrelo_token: user.zinreloToken,
        };
        const secretkey = process.env.ACCESS_TOKEN_SECRET;
        const accessToken = jwt.sign({ payload }, secretkey, {
          expiresIn: "1h",
        });
        res.json({ accessToken });
        // return res.json({ msg: "Succeed with google" });
      } else if (user.signOption === 2 && user.facebook_id) {
        return res.json({ msg: "logined successfuly with facebook" });
      } else if (user.signOption === 3 && user.apple_id) {
        return res.json({ msg: "logined successfuly with Apple" });
      } else {
        return res
          .status(500)
          .json({ msg: "Already logined with email manually" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Sign with google error",
    });
  }
};

export const signupGoogle = async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`
    );
    const { email, given_name, family_name } = response.data;

    const user = await Users.findOne({
      where: {
        email: response.data.email,
      },
    });

    if (!user) {
      const zinrelo_payload = {
        member_id: email,
        first_name: given_name,
        last_name: family_name,
        email_address: email,
        // phone_number: phone,
        // birthdate: formattedDate,
      };
      const isAdded = await addZinreloMember(zinrelo_payload);
      const zinrelo_token = await createZinreloToken(zinrelo_payload);
      await Users.create({
        firstName: given_name,
        lastName: family_name,
        email: email,
        signOption: 1,
        google_id: 1,
        zinreloToken: zinrelo_token,
      });
      return res.json({ msg: "User registered" });
    } else {
      return res.json({ msg: "Already user registered" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Sign with Google error",
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
