const { query } = require('../db/db-service');

//const pool = require('../db/db-service');

class skillsModel {
    // Add a skill
    addSkill = async (skillName, isLang) => {
        const insertQuery = `
        INSERT INTO skills (name, isLang)
        VALUES ($1, $2)
        RETURNING id, name;`;

        try {
            const result = await query(insertQuery, [skillName, isLang]);
            return result; // Return the ID of the newly added skill
        } catch (error) {
            console.error('Error adding skill:', error);
            throw new Error('Failed to add skill');
        }
    }

    // Retrieve the ID of a skill by its name
    getSkillIdByName = async (skillName, isLang) => {
        const selectQuery = `
        SELECT *
        FROM skills
        WHERE name ILIKE $1
        AND isLang = $2;
        `;

        try {
            const result = await query(selectQuery, [skillName, isLang]);

            // Check if the skill was found
            return result;
        } catch (error) {
            console.error('Error retrieving skill id:', error);
            throw new Error('Failed to retrieve skill id');
        }
    }

    //for internship_skill
    getSkillsByArrayInt = async (skillNames) => {
        if (!Array.isArray(skillNames) || skillNames.length === 0) {
            throw new Error('Skill names must be a non-empty array');
        }
        
        const selectQuery = `
            SELECT id, name
            FROM skills
            WHERE name IN (${skillNames.map((_, index) => `$${index + 1}`).join(',')});
        `;
            
        try {
            const result = await query(selectQuery, skillNames);
            console.log("result", result, "rags", skillNames);
            return result;
        
        } catch (error) {
            console.error('Error retrieving skills:', error);
            throw new Error('Failed to retrieve skills');
        }
    };

    getSkillsByArray = async (skillNames) => {
        if (!Array.isArray(skillNames) || skillNames.length === 0) {
            throw new Error('Skill names must be a non-empty array');
        }
    
        const selectQuery = `
            SELECT id, name
            FROM skills
            WHERE name IN (${skillNames.map((_, index) => `$${index + 1}`).join(',')})
            AND isLang = true;
        `;
            
        try {
            const result = await query(selectQuery, skillNames);
            console.log("result", result, "rags", skillNames);
            return result;
        
        } catch (error) {
            console.error('Error retrieving skills:', error);
            throw new Error('Failed to retrieve skills');
        }
    };

    insertSkillByArray = async(skillData) => {
        if (!Array.isArray(skillData) || skillData.length === 0) {
            throw new Error('Skill names must be a non-empty array');
        }

        const insertQuery = `
        INSERT INTO skills (name)
        SELECT UNNEST($1)
        RETURNING id, name;
      `;
    
      //const values = [skillData]; // Assuming skillData is an array of skill names
    
      try {
        console.log("skillData", skillData);
        const result = await query(insertQuery, skillData);
        console.log("result", result);
      } catch (error) {
        console.log(error);
      }   
    
    }

    searchDb = async(input) => {
        const Iquery = `SELECT name, isLang
        FROM skills
        WHERE name ILIKE $1 || '%'
        LIMIT 5;`
        try{
            const result = await query(Iquery, input);
            return result;
        }catch(err){
            console.log(err);
        }
    }

    deductScores = async(id) => {
        const Query = `
        UPDATE user_skill AS us
        SET score = us.score - ps.score
        FROM project_skill AS ps
        WHERE us.skill_id = ps.skill_id
        AND ps.project_id = $1;
        `
        try{
            const result = await query(Query, [id]);
            return result;
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = new skillsModel;
