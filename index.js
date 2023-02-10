const server = require("./src/app.js");
const express = require("express");
const { conn } = require("./src/db.js");
const morgan = require("morgan");
const port = process.env.PORT || 3001;

const { preload_players } = require("./src/utils/utilsPlayers.js");
const { preload_teams } = require("./src/utils/utilsTeams.js");
const { preload_tournaments } = require("./src/utils/utilsTournaments.js");
const { preload_admin } = require("./src/utils/users.js");

const app = express();

app.use(morgan("dev"));

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(port, () => {
    preload_admin();
    preload_tournaments();
    preload_players();
    preload_teams();
    console.log(`listening at ${port}`); // eslint-disable-line no-console
  });
});
