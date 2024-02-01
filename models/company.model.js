const { query } = require('../db/db-service');

class Company {
    addCompany = async({name, bio, est_date, link, userId}) => {
        const insertQuery = `
        INSERT INTO Company (userId , name, bio , est_date, link) VALUES ($1, $2, $3, $4)
        `
        try{
            const result = await query (insertQuery, [userId, name, bio, est_date, link]);
            return result;
        }catch(error){
            console.error('Error adding company', error);
            throw new Error('Failed to add company');
        }
    }

    deleteCompany = async({company_Id, userId}) => {
        const deleteQuery = `
        DELETE FROM Company WHERE Company_id = $1 AND UserId = $2
        `
        try{
            const result = await query (deleteQuery, [company_Id, userId]);
        }catch(error){

        }
    }

}