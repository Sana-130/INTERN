const Pool = require("pg").Pool;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password:"letmein",
    port: 5432,
    database:"intern"
});

const query = async (sql, values) => {
    try {
        const result = await pool.query(sql, values);
        return result.rows;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to execute query');
    }
};

module.exports = { pool, query };