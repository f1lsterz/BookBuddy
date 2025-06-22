import { Sequelize } from "sequelize";

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

const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  logging: NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
