import Users from "../models/UserModel.js";
import UserData from "../models/UserDataModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req,
      },
      include: UserData,
    });

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      id,
      firstName,
      lastName,
      email,
      password,
      birthday,
      phone,
      country,
      address1,
      address2,
      province,
      postcode,
    } = req.body;

    // Find the user in the database
    let user = await Users.findByPk(id, { include: UserData });

    if (!user) {
      console.log("asdfasdf");
      return res.status(404).json({ msg: "User not found" });
    }
    // Update user's data
    const updatedUserData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };

    if (password) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      updatedUserData.password = hashPassword;
    }

    // Update Users table
    await Users.update(updatedUserData, {
      where: {
        id: id,
      },
    });

    // Update or create UserData
    if (!UserData) {
      return res.status(404).json({ msg: "UserData not found" });
    }
    // Update UserData
    await UserData.update(
      {
        birthday: birthday,
        phone: phone,
        country: country,
        address1: address1,
        address2: address2,
        province: province,
        postcode: postcode,
      },
      {
        where: {
          user_id: id,
        },
      }
    );

    // Fetch user again to get updated data
    user = await Users.findByPk(id, { include: UserData });

    res.json({ msg: "User updated successfully", user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const Register = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    birthday,
    phone,
    country,
    address1,
    address2,
    province,
    postcode,
  } = await req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const insertUser = await Users.create({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: hashPassword,
      signOption: 0,
    });

    await UserData.create({
      user_id: insertUser.id,
      birthday: birthday,
      phone: phone,
      country: country,
      address1: address1,
      address2: address2,
      province: province,
      postcode: postcode,
    });

    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const payload = {
      userId: user[0].id,
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      email: user[0].email,
    };
    const secretkey = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign({ payload }, secretkey, {
      expiresIn: "1h",
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
  }
};

export const getGoogleAuth = async (req, res) => {
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
};

export const googleLogin = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const payload = {
      userId: user[0].id,
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      email: user[0].email,
    };
    const secretkey = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign({ payload }, secretkey, {
      expiresIn: "1h",
    });
    // const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
    //     expiresIn: '1d'
    // });
    // await Users.update({ refresh_token: refreshToken }, {
    //     where: {
    //         id: userId
    //     }
    // });
    // res.cookie('refreshToken', refreshToken, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000
    // });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
