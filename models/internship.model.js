const { query } = require('../db/db-service');
const pool = require('../db/db-service');

class Internship {
    addInternship = async ({title, description, company_id, last_date, unpaid, min_salary, max_salary, is_active, user_id }) => {
        const insertQuery = `
            INSERT INTO internships (title, description, company_id,  last_date, unpaid, min_salary, max_salary, is_active) VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8)
        `
        try{
            const result = await query (insertQuery, [title, description, company_id, last_date, unpaid, min_salary, max_salary, is_active]);

        }catch(error){
            console.error('Error adding internship', error);
            throw new Error('Failed to add internship');
        }
    }

    checkExist = async ({user_id, compId}) =>{
        const checkQuery = `
        SELECT FROM Company WHERE user_id = $1 AND comp_id = $2
        `
        try{
            const result = await query (checkQuery, [user_id, compId]);
            return result;
        }catch(error){
            console.error('Error fetching the company page of user', error);
            throw new Error('Error fetching the company for the user');
        }
    }
//
// even though we are saying unpaid = COALESCE(NULLIF($4, ''), unpaid), we have to make its not '' value.
/* ` UPDATE internships
    SET title = COALESCE($2, title),
    description = COALESCE($3, description),
    unpaid = COALESCE($4, unpaid),
    last_date = COALESCE($5, last_date),
    max_salary = CASE WHEN unpaid THEN 0 ELSE $6 END,
    min_salary = CASE WHEN unpaid THEN 0 ELSE $7 END,
    is_active = COALESCE($8, is_active)
    WHERE id = $1*/
    updateInternship = async({id, title, description, unpaid , last_date,  min_salary, max_salary, is_active})=>{
        const updateQuery = 
       `
       UPDATE internships
        SET
            title = CASE WHEN $2 IS DISTINCT FROM title AND $2 IS NOT NULL THEN $2 ELSE title END,
            description = CASE WHEN $3 IS DISTINCT FROM description AND $3 IS NOT NULL THEN $3 ELSE description END,
            unpaid = CASE WHEN $4 IS DISTINCT FROM unpaid AND $4 IS NOT NULL THEN $4 ELSE unpaid END,
            last_date = CASE WHEN $5 IS DISTINCT FROM last_date AND $5 IS NOT NULL THEN $5 ELSE last_date END,
            max_salary = CASE WHEN unpaid THEN 0 ELSE $6 END,
            min_salary = CASE WHEN unpaid THEN 0 ELSE $7 END,
            is_active = CASE WHEN $8 IS DISTINCT FROM is_active AND $8 IS NOT NULL THEN $8 ELSE is_active END
        WHERE id = $1;

       `
           
        
        const updateQ = 
        `
        UPDATE internships
        SET title = CASE WHEN $2 IS NOT NULL AND $2 IS DISTINCT FROM title THEN $2 ELSE title END 
        WHERE id = $1
        
        `
        try{
           //const result = await pool.query({
            //    text: updateQuery,
            //    values: [id, title, description, unpaid, last_date, min_salary, max_salary, is_active],
            //    types: ['integer', 'text', 'text', 'boolean', 'text', 'numeric', 'numeric', 'boolean'],
            //  });
            //console.log(id, title, description, unpaid , last_date,  min_salary, max_salary, is_active);
            const result = await query (updateQuery, [id, "PEEKABO", description, null , last_date,  min_salary, max_salary, null]);
             //   ['integer', 'text', 'text', 'boolean', 'text', 'numeric', 'numeric', 'boolean']);
           // const re = await query (updateQ, [id, null]);
            
        }catch(error){
            console.error('Error updating internship', error);
            throw new Error('Failed to update internship');
        }
    }

    deleteInternship = async({ post_id }) => {
        const deleteQuery = 
        `
        DELETE FROM Internship WHERE id = $1 
        `
        try{
            const result = await query (deleteQuery, [post_id])
        }catch(error){
            console.error('Error deleting internship', error);
            throw new Error('Failed to delete internship');
        }
    }
}

module.exports = new Internship;