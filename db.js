const Pool = require("pg").Pool;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password:"letmein",
    port: 5432,
    database:"intern"
});

module.exports = pool;