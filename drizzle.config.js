require('dotenv').config();

module.exports = {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  driver: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        password: process.env.DB_PASSWORD
  }
};
