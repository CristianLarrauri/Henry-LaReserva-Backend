require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, PORT, DB_NAME } = process.env;

console.log("Entrando al db");

const sequelize = new Sequelize('dbdu6udge9jour', 'qtmnqrnqsscwnl', '7a82624a75f60ed1ddb9a974df64f6e30c4a359ce683d8909c01ec0552aa93eb', {
	host: 'ec2-3-219-19-205.compute-1.amazonaws.com',
	dialect: 'postgres',
	port: 5432,
	logging: console.log('La conexion a la DB ha sido exitosa'),
	dialectOptions: {
		ssl: {
		  require: true,
		  rejectUnauthorized: false
		}
	  }
  });


const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners

fs.readdirSync(path.join(__dirname, '/models'))
	.filter(
		(file) =>
			file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
	)
	.forEach((file) => {
		modelDefiners.push(require(path.join(__dirname, '/models', file)));
	});
;
// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
	entry[0][0].toUpperCase() + entry[0].slice(1),
	entry[1]
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Teams, Players, Tournaments, Users, Buys } = sequelize.models;

Teams.belongsToMany(Tournaments, { through: 'teams_tournaments' });
Tournaments.belongsToMany(Teams, { through: 'teams_tournaments' });

Players.belongsToMany(Teams, { through: 'players_teams' });
Teams.belongsToMany(Players, { through: 'players_teams' });
Tournaments.belongsToMany(Players, { through: 'tournaments_players' });
Players.belongsToMany(Tournaments, { through: 'tournaments_players' });

Tournaments.hasMany(Buys);
Buys.belongsTo(Tournaments);
// Users.hasMany(Buys); descomentar cuando se mergee a developer
// Buys.belongsTo(Users);

console.log('FIN');

module.exports = {
	...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
	conn: sequelize // para importart la conexión { conn } = require('./db.js');
};