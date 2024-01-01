
const { query } = require('../db/db-service');

class UserProject {
    addProject = async ({userId, projectId}) =>{
        const insertQuery = `
        INSERT INTO project (user_id, project_link) 
        VALUES($1, $2)
        `
        try {
            const result = await query(insertQuery, [ userId, projectId]);
            return result; // Return the ID of the newly added skill
        } catch (error) {
            console.error('Error adding project to user', error);
            throw new Error('Failed to add project to user');
        }

    }

    getSkills = async (projectId) =>{
        const getSkillQuery = `
        SELECT skills.skill_name
        FROM skills
        JOIN project_skill ON skills.id = project_skill.skill_id
        WHERE project_skill.project_id = $1;
        `
        try {
            const result = await query(getSkillQuery, [projectId]);
            return result;
        } catch (error) {
            console.error('Error retrieving skills of a project', error);
            throw new Error('Failed to retrieve skills of a project');
        }

    }

    //getProjectLink = async (projectId) =>{
    //    const getLink = `
    //    SELECT project_link FROM project WHERE project_id
    //    `
    //}
    getProjectByUserId = async({project_id, userId}) => {
        const selectQuery = `
        SELECT * FROM project WHERE user_id = $1 
        `

        try{
            const query = await query(selectQuery, [project_id, userId]);
            return result;
        }catch(error){
            console.error('Error retreiveing projects of a user', error);
            throw new Error('Failed retreiveing projects of a user');
        }
    }

    //only delete project if related skills are deleted.
    deleteProject = async ({project_id, userId}) => {
        const deleteQuery = `
        DELETE FROM project WHERE user_id = $1 AND project_id = $2
        `

        try {
            const result = await query(deleteQuery, [ project_id, userId]);
            return result; // Return the ID of the newly added skill
        } catch (error) {
            console.error('Error deleting project from user', error);
            throw new Error('Failed deleting project from user');
        }
    }

    
}

module.exports = new UserProject;