const { query } = require('../db/db-service');

class ProjectSkill {
    
    addSkill = async (projectId, skillId, skill_score) => {
        const insertQuery = `
        INSERT INTO project_skill (project_id , skill_id, score) 
        VALUES ($1, $2, $3)
        `
        try{
            const result = await query(insertQuery, [projectId, skillId, skill_score]);
            return result;
        }catch(error){
            console.error('Error adding skill to project', error);
            throw new Error('Failed to add skill to project');
        }
    }

    addScore = async (user_id, skill_id, score) => {
        const insertQuery = `
        INSERT INTO user_skill (user_id, skill_id, score)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, skill_id) DO UPDATE
        SET score = user_skill.score + EXCLUDED.score;
    `
        try{
            const result = await query(insertQuery, [user_id, skill_id, score]);
            return result;
        }catch(error){
            console.error('Error adding skill to project', error);
            throw new Error('Failed to add skill to project');
        }
    }

/*    addScore = async(user_id, skill_id, score) => {
        try{
            const query = `INSERT INTO user_skill(user_id, skill_id, score)
            VALUES ($1, $2, $3)`

            const result = await query(query, [user_id, skill_id, score]);
            return result.rows[0].row_exists;
        }catch(err){
            console.log(err);
        }
    } */
    
}

module.exports = new ProjectSkill;