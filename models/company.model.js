const { query } = require('../db/db-service');

class Company {
    addCompany = async({name, bio, location, link, userId}) => {
        const insertQuery = `
        INSERT INTO Company (name, bio , location, link, user_id) VALUES ($1, $2, $3, $4, $5)
        `
        try{
            const result = await query (insertQuery, [name, bio, location, link, userId]);
            return result;
        }catch(error){
            console.error('Error adding company', error);
            throw new Error('Failed to add company');
        }
    }

    getByUser = async(user_id) => {
        const Iquery = `SELECT id, name, location FROM company WHERE user_id = $1;`

        try{
            const result = await query(Iquery, [user_id]);
            return result;
        }catch(error){
            console.error('Error adding company', error);
            throw new Error('Failed to add company');
        }

    }

    editCompany = async(user_id, name, bio, location, link , company_id) => {
        const Iquery = `UPDATE Company
            SET
            name = CASE WHEN $2 IS DISTINCT FROM name THEN $2 ELSE name END,
            bio = CASE WHEN $3 IS DISTINCT FROM bio THEN $3 ELSE bio END,
            location = CASE WHEN $4 IS DISTINCT FROM location THEN $4 ELSE location END,
            link = CASE WHEN $5 IS DISTINCT FROM link THEN $5 ELSE link END
        WHERE user_id = $1 AND id = $6`

        try{
            const result = await query(Iquery, [user_id, name, bio, location, link , company_id]);
            return result;
        }catch(error){
            console.error('Error adding company', error);
            throw new Error('Failed to add company');
        }
    }

    getById = async(id) => {
        const Iquery = `SELECT * FROM Company WHERE id = $1;`
        try{
            const result = await query(Iquery, [id]);
            return result;
        }catch(error){
            console.error('Error adding company', error);
            throw new Error('Failed to add company');
        }
    }

    deleteCompany = async(user_id, id) => {
        const deleteQuery = `
        DELETE FROM Company WHERE user_id = $1 AND id = $2
        `
        try{
            const result = await query (deleteQuery, [user_id, id]);
        }catch(error){

        }
    }

    getIDComp = async(user_id) =>{
        const Iquery = `SELECT id, name FROM Company WHERE user_id = $1;`
        try{
            const result = await query(Iquery, [user_id]);
            return result;
        }catch(error){
            console.log(error);
        }
    }

    checkExistsInternship = async(id) => {
        const Iquery = `SELECT EXISTS (
            SELECT 1
            FROM internships
            WHERE company_id = $1
        ) AS exists;`
        try{
            const result = await query(Iquery, [id]);
            return result[0].exists;
        }catch(err){
            console.log(err);
        }
    }

    checkOwner = async(id) => {
        const Iquery = `
        SELECT user_id FROM company WHERE id = $1
        `
        try{
            const result = await query(Iquery, [id]);
            return result;
        }catch(err){
            console.log(err);
        }
    }

    getNotVerified = async(offset) => {
        const Iquery = `SELECT 
        c.id,
        c.name,
        c.location,
        c.verified,
        u.first_name,
        u.last_name,
        u.email
    FROM 
        company AS c
    JOIN 
        user_info AS u ON c.user_id = u.user_id
    WHERE 
        c.verified = false
    OFFSET $1
    LIMIT 10;
    
    `
    try{
        const result = await query(Iquery, [offset]);
        return result;
    }catch(err){
        console.log(err);
    }
    }

    getLength = async() => {
        const Iquery = `
        SELECT COUNT(*) AS total_records FROM company;
    `
        try{
            const result = await query(Iquery, []);
            return result;
        }catch(err){
            console.log(err);
        }
    }

    search = async(input) => {
        const Iquery = `
            SELECT 
            c.id,
            c.name,
            c.location,
            c.verified,
            u.first_name,
            u.last_name,
            u.email
        FROM 
            company AS c
        JOIN 
            user_info AS u ON c.user_id = u.user_id
        WHERE 
            LOWER(c.name) LIKE $1 || '%'
        LIMIT 10;
        `
        try{
            const result = await query(Iquery, [input]);
            return result;
        }catch(err){
            console.log(err);
        }
    }

    verify = async(id) => {
        const Iquery = `
        UPDATE company
        SET verified = true
        WHERE id = $1;
        `
        try{
            const result = await query(Iquery, [id]);
            return result;
        }catch(err){
            console.log(err);
        }
    }

    
}
module.exports = new Company;