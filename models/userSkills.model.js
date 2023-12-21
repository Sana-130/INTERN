const { query } = require('../db/db-service');

//add skill
class Skill {
    addSkill = async ({user_Id , skill_Id}) =>{
        const insertQuery = `
        INSERT INTO user_skill (user_id , skill_id)
        VALUES ($1, $2)
        `
        try{
            const result = await query(insertQuery, [user_Id, skill_Id]);
            return result;
        }catch(error){
            console.error('Error adding skill to user', error);
            throw new Error('Failed to add skill to user');
        }
    }

    deleteSkill = async ({user_Id, skill_Id}) =>{
        const deleteQuery = 
        `
        DELETE FROM user_skill WHERE user_id = $1 AND skill_id = $2
        `
        try{
            const result = await query(deleteQuery, [user_Id, skill_Id]);
            return result;
        }catch(error){
            console.error('Error deleting skill from user:', error);
            throw new Error('Failed to delete skill from user');
        }

    }
}
//delete skill

