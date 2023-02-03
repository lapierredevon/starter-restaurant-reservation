/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const {
  DATABASE_URL = "postgres://erceehsr:PMRo5LkQw9-4maPyO02j83Y6qkklz5oX@salt.db.elephantsql.com/erceehsr",
  DATABASE_URL_DEVELOPMENT = "postgres://qubzevwf:vyoq17ZG5AXKyHnRFPeuM5P_Ol5N1ThL@salt.db.elephantsql.com/qubzevwf",
  DATABASE_URL_TEST = "postgres://cjnyuivm:k3w67yusvH40jSNwgbF4aIXJEUEfopBX@salt.db.elephantsql.com/cjnyuivm",
  DATABASE_URL_PREVIEW = "postgres://ggccfikr:f9Dz7z15gKuBEdnjOxhwou5MZ-nq_Uw1@salt.db.elephantsql.com/ggccfikr",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
