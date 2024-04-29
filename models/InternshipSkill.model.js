const { query } = require('../db/db-service');
const pool = require('../db/db-service');

class InternshipSkill{
    addSkill = async (internship_id, skill_id) => {
        const insertQuery = `INSERT INTO internship_skill (internship_id, skill_id)
        VALUES ($1, $2) 
        ON CONFLICT (internship_id, skill_id) DO NOTHING;`

        try{
            const result = await query (insertQuery, [internship_id, skill_id]);
            return result;
        }catch(error){
            console.error('Error adding internship', error);
            throw new Error('Failed to add internship');
        }
    }

    deleteSkill = async(internship_id, skill_id) => {
        const deleteQ = `DELETE FROM internship_skill WHERE internship_id = $1 AND skill_id = $2;`

        try{
            const result = await query(deleteQ , [internship_id, skill_id]);
            return result;
        }catch(error){
            console.error('Error deleting internship skill', error);
            throw new Error('Failed to delete internship skill');
        }
    }
}

module.exports = new InternshipSkill;