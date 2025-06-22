import Library from "../models/library";
import User from "../models/user";
import { ApiError } from "../utils/apiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AuthService {
  private generateJwt = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  };

  async registration(email, password, role, name) {
    if (!email || !password || !name || !role) {
      throw ApiError.BadRequest("All fields are required");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.BadRequest(`User with email ${email} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      name,
      password: hashPassword,
      role,
    });

    const defaultLibraries = [
      "Favourite",
      "Reading",
      "Already read",
      "Wanna read",
      "Dropped",
    ];
    const libraries = defaultLibraries.map((status) => ({
      status,
      userId: user.id,
    }));
    await Library.bulkCreate(libraries);

    const token = this.generateJwt(user.id, user.email, user.role);
    return { token };
  }

  async login(email, password) {
    if (!email || !password) {
      throw ApiError.BadRequest("Email and password are required");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest("User with this email was not found");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Incorrect password");
    }
    const token = this.generateJwt(user.id, user.email, user.role);
    return { token };
  }
}

export default new AuthService();
