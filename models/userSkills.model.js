const { query } = require('../db/db-service');

//add skill
class Skill {
    addSkill = async (user_Id , skill_Id) =>{
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

    addScore = async(user_id, skill_id, score) => {
        try{
            const Iquery = `INSERT INTO user_skill(user_id, skill_id, score)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, skill_id) DO UPDATE
            SET score = project_skill.score + EXCLUDED.score;`

            const result = await query(Iquery, [user_id, skill_id, score]);
            return result.rows[0].row_exists;
        }catch(err){
            console.log(err);
        }
    }

    
    getSkillDatas = async(user_id) => {
        try{
            const Iquery = `
            SELECT s.name, us.score, s.isLang
            FROM user_skill us
            JOIN skills s ON us.skill_id = s.id 
            WHERE us.user_id = $1;
            `
            const result = await query(Iquery, [user_id]);
            return result;
        }catch(err){
            console.log(err);
        }
    }

    getSkillData = async(user_id) => {
        try{
            const Iquery = `
            SELECT s.name, us.score
            FROM user_skill us
            JOIN skills s ON us.skill_id = s.id AND s.isLang = true
            WHERE us.user_id = $1;
            `
            const result = await query(Iquery, [user_id]);
            return result;
        }catch(err){
            console.log(err);
        }
    }


    checkExists = async({user_id, skill_id}) => {
        try {
            const query = `
                SELECT EXISTS (
                  SELECT 1
                  FROM user_skill
                  WHERE user_id = $1
                  AND skill_id = $2
                ) AS row_exists;
              `
            const result = await query(query, [user_id, skill_id]);
            return result.rows[0].row_exists;
          } catch (error) {
            console.error('Error checking existence:', error);
            throw error;
          }
    }


    deleteSkill = async (user_Id, skill_Id) =>{
        const deleteQuery = 
        `
        DELETE FROM user_skill 
        WHERE 
        user_id = $1 
        AND skill_id = $2 
        AND skill_id IN (SELECT id FROM skills WHERE isLang = false);

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

module.exports = new Skill;

