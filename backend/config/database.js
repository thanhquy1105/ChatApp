require("dotenv").config({ path: "backend/.env" });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_URL || process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_URL || process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_URL || process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    use_env_variable: "DATABASE_URL",
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
