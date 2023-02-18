const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//API 1
app.get("/players/", async (request, response) => {
  const sql = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const cricketTeam = await db.all(sql);
  response.send(cricketTeam);
});
//API 2
app.post("/players/", async (request, response) => {
  const cricketDetails = request.body;
  const { playerName, jerseyNumber, role } = cricketDetails;
  const sqls = `INSERT INTO cricket (playerName, jerseyNumber, role) VALUES (${playerName},${jerseyNumber},${role});`;
  const dbResponse = await db.run(sqls);
  const player_id = dbResponse.lastID;
  response.send({ player_id: player_id });
});
//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getcricket = `SELECT * FROM cricket_team WHERE player_id=${playerID};`;
  const cricket = await db.get(getcricket);
  response.send(cricket);
});
//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `UPDATE cricket_team SET playerName=${playerName},jerseyNumber=${jerseyNumber},role=${role} WHERE player_id=${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});
//API 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteBookQuery = `DELETE FROM cricket_team WHERE player_id=${playerID};`;
  await db.run(deleteBookQuery);
  response.send("Player Removed");
});
module.exports = app;
