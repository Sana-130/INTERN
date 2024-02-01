const { query } = require('../db/db-service');

class InternshipApply{
    addApplicant = async({userId, internshipId, applied_date}) => {
        const insertQuery = `INSERT INTO InternshipApply (userid , internshipId, applied_date) VALUES ($1, $2, $3)`
        try{
            const result = await query(insertQuery, [userId, internshipId, applied_date]);
            return result;
        }catch(error){
            console.error('Error adding company', error);
            throw new Error('Failed to add company');
        }
    }

    getApplicants = async({internshipId}) => {
        const getQuery = 
        `SELECT
            up.userid,
            up.firstname,
            up.lastname,
            ia.internshipId,
            ia.applied_date
        FROM
            internshipApply ia
        JOIN
            userProfile up ON ia.userid = up.userid
        WHERE
            ia.internshipId = $1 ;`

        try{
            const result = await query(getQuery, [internshipId]);
            return result;
        }catch(error){
            console.error('Error adding company', error);
            throw new Error('Failed to add company');
        }
    }
   

}

module.exports = new InternshipApply;