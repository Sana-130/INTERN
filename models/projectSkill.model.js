const { query } = require('../db/db-service');

class ProjectSkill {
    
    addSkill = async ({projectId, skillId, skill_score}) => {
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

    

    deleteSkill = async ({projectId, skillId}) => {
        const deleteQuery = `
        DELETE FROM project_skill WHERE project_id = $1 AND skill_id = $2
        `
        try{
            const result = await query(deleteQuery, [projectId, skillId]);
            return result;
        }catch(error){
            console.error('Error deleting skill to project', error);
            throw new Error('Failed to deleting skill to project');
        }
    }
    
}

module.exports = new ProjectSkill;