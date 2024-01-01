const { query } = require('../db/db-service');

//const pool = require('../db/db-service');

class skillsModel {
    // Add a skill
    addSkill = async (skillName) => {
        const insertQuery = `
            INSERT INTO skills (skill_name)
            VALUES ($1)
            RETURNING id;
        `;

        try {
            const result = await query(insertQuery, [skillName]);
            return result; // Return the ID of the newly added skill
        } catch (error) {
            console.error('Error adding skill:', error);
            throw new Error('Failed to add skill');
        }
    }

    // Retrieve the ID of a skill by its name
    getSkillIdByName = async (skillName) => {
        const selectQuery = `
        SELECT * FROM skill WHERE name ILIKE $1;
        `;

        try {
            const result = await query(selectQuery, [skillName]);

            // Check if the skill was found
            return result;
        } catch (error) {
            console.error('Error retrieving skill id:', error);
            throw new Error('Failed to retrieve skill id');
        }
    }
}

module.exports = new skillsModel;
