import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../models/Users.js";
import {
  createSession,
  deleteSessionByRefreshToken,
  findSessionByRefreshToken,
} from "../models/Session.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

export const signUp = async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    if (!username || !password || !email || !name) {
      return res
        .status(400)
        .json({
          message: "Khong the thieu username, password, email hoac name",
        });
    }

    const duplicateUsername = await findUserByUsername(username);
    if (duplicateUsername) {
      return res.status(409).json({ message: "Username da ton tai" });
    }

    const duplicateEmail = await findUserByEmail(email);
    if (duplicateEmail) {
      return res.status(409).json({ message: "Email da ton tai" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, hashedPassword, email, name);

    return res.status(201).json({
      message: "Dang ky thanh cong",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Loi server khi dang ky", error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    // lấy input
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Khong the thieu email hoac password" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email khong hop le" });
    }
    if (email.length > 255) {
      return res
        .status(400)
        .json({ message: "Email khong duoc qua 255 ky tu" });
    }
    // lấy hash password từ database
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Sai email hoac password" });
    }

    // so sánh password với hash password
    const passwordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Sai email hoac password" });
    }

    //nếu khớp, tạo token và trả về cho client
    const accessToken = jwt.sign(
      { user_id: user.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    // tạo refresh token và lưu vào database
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // tạo session mới để lưu refresh token
    await createSession(user.user_id, refreshToken);

    // trả refresh token về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });
    // trả access token về cho res
    return res.status(200).json({
      message: "Dang nhap thanh cong",
      user: {
        user_id: user.user_id,
        accessToken,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Loi server khi dang nhap", error: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies.refreshToken;

    // xóa refresh token trong session database
    if (token) {
      await deleteSessionByRefreshToken(token);

      // xóa cookie refresh token
      res.clearCookie("refreshToken");
    }

    return res.status(200).json({ message: "Dang xuat thanh cong" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Loi server khi dang xuat", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Token khong hop le" });
    }

    const session = await findSessionByRefreshToken(token);

    if (!session) {
      return res.status(403).json({ message: "Token khong hop le" });
    }

    if (session.expires_at < new Date()) {
        return res.status(403).json({ message: "Token da het han" });
    }
    const accessToken = jwt.sign(
      { user_id: session.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    return res.status(200).json({
      message: "Refresh token thanh cong",
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Loi server khi refresh token", error: error.message });
  }
};
