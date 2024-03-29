require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DEPLOY } = process.env;

/* const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/reserva`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
); */

const sequelize = new Sequelize(DB_DEPLOY, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Teams, Players, Tournaments, Users, Buys, Reviews, PaymentDetails } =
  sequelize.models;

Teams.belongsToMany(Tournaments, { through: "teams_tournaments" });
Tournaments.belongsToMany(Teams, { through: "teams_tournaments" });

Players.belongsToMany(Teams, { through: "players_teams" });
Teams.belongsToMany(Players, { through: "players_teams" });

Tournaments.belongsToMany(Players, { through: "tournaments_players" });
Players.belongsToMany(Tournaments, { through: "tournaments_players" });

Teams.belongsToMany(Users, { through: "teams_users" });
Users.belongsToMany(Teams, { through: "teams_users" });

// Tournaments.hasMany(Buys);
// Buys.belongsTo(Tournaments);

// Users.hasMany(Buys); descomentar cuando se mergee a developer
// Buys.belongsTo(Users);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
