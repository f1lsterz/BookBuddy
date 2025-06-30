import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import path from "path";

const requiredEnvVars = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(`❌ Missing environment variables: ${missing.join(", ")}`);
}

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, NODE_ENV } =
  process.env;

const sequelize: Sequelize = new Sequelize({
  dialect: "mysql" as Dialect,
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30_000,
    idle: 10_000,
  },
  models: [path.resolve(__dirname, "../models")],
});

export default sequelize;
