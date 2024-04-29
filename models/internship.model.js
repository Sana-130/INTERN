const { query } = require('../db/db-service');
const pool = require('../db/db-service');

class Internship {
    addInternship = async (title, description, company_id, last_date, min_salary, max_salary) => {
        const insertQuery = `
            INSERT INTO internships (title, description, company_id,  last_date, min_salary, max_salary) VALUES 
            ($1, $2, $3, $4, $5, $6) RETURNING id;
        `
        try{
            const result = await query (insertQuery, [title, description, company_id, last_date, min_salary, max_salary]);
            return result;
        }catch(error){
            console.error('Error adding internship', error);
            throw new Error('Failed to add internship');
        }
    }

    getInternships = async() => {
        const getQuery = `SELECT i.id, i.createdAt, i.title, i.min_salary, i.max_salary, c.location, c.name, c.user_id AS company_name, c.verified
        FROM internships AS i
        JOIN company AS c ON i.company_id = c.id
        ORDER BY i.createdat DESC;        
        `
        try{
            const result = await query(getQuery, []);
            return result;
        }catch(error){
            console.error('Error getting internships', error);
            throw new Error('Failed to get internships');
        }
    }

    sortApplicants = async (internshipId, skillIds) => {
        // Construct the dynamic SQL query
        let Iquery = `
        SELECT 
        u.first_name,
        u.last_name,
        CASE ia.status 
            WHEN 'p' THEN 'Pending'
            WHEN 's' THEN 'Approved'
            WHEN 'r' THEN 'Rejected'
            ELSE 'Unknown' 
        END AS status,
        ia.apply_date,
        p.contact_mail,
        MAX(us.score) AS max_score
    FROM 
        internship_apply AS ia
    JOIN 
        user_info AS u ON ia.user_id = u.user_id
    LEFT JOIN 
        profile AS p ON ia.user_id = p.user_id
    JOIN 
        user_skill AS us ON u.user_id = us.user_id
    WHERE 
        ia.internship_id = $1
        AND us.skill_id IN (${skillIds.join(', ')})
    GROUP BY 
        ia.user_id,
        u.first_name,
        u.last_name,
        ia.status,
        ia.apply_date,
        p.contact_mail
    ORDER BY 
        max_score DESC;
    
        `;
        
        try {
            // Execute the query
            const result = await query(Iquery, [internshipId]);
            return result;
        } catch (err) {
            console.error('Error sorting applicants:', err);
            throw new Error('Failed to sort applicants');
        }
    };
    
    getInternshipById = async(id) => {
        const getQuery = `SELECT 
        i.*, 
        c.name AS company_name,
        c.user_id AS user_id, 
        c.location AS location, 
        ARRAY_AGG(json_build_object('id', s.id, 'name', s.name, 'isLang', s.isLang)) AS skills
    FROM 
        internships AS i
    LEFT JOIN 
        internship_skill AS isk ON i.id = isk.internship_id
    LEFT JOIN 
        skills AS s ON isk.skill_id = s.id
    JOIN 
        company AS c ON i.company_id = c.id
    WHERE 
        i.id = $1
    GROUP BY 
        i.id, c.name, c.user_id, c.location;`
        try{
            const result = await query(getQuery, [id]);
            return result;
        }catch(error){
            console.error('Error getting internships', error);
            throw new Error('Failed to get internships');
        }
        
    }

    getAppliedDetails = async(id)=> {
        const Iquery = `SELECT 
        u.user_id, 
        u.first_name, 
        u.last_name, 
        p.contact_mail, 
        ia.apply_date, 
        CASE ia.status 
            WHEN 'p' THEN 'Pending'
            WHEN 's' THEN 'Approved'
            WHEN 'r' THEN 'Rejected'
            ELSE 'Unknown' 
        END AS status
    FROM 
        internship_apply AS ia
    JOIN 
        user_info AS u ON ia.user_id = u.user_id
    LEFT JOIN 
        profile AS p ON ia.user_id = p.user_id
    WHERE 
        ia.internship_id = $1;
        `
        try{
            const result = await query(Iquery, [id]);
            return result;
        }catch(error){
            console.error('Error getting internships', error);
            throw new Error('Failed to get internships');
        }
    }

    apply = async(id , user_id) => {
        const Iquery = `INSERT INTO internship_apply (internship_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (internship_id, user_id) DO NOTHING;
        `
        try{
            const result = await query(Iquery, [id, user_id]);
            return result;
        }catch(error){
            console.error('Error getting internships', error);
            throw new Error('Failed to get internships');
        }

    }

    getApplied = async(user_id) => {

        const Iquery = `SELECT i.*
        FROM internship_apply ia
        JOIN internships i ON ia.internship_id = i.id
        WHERE ia.user_id = $1;
        `
        try{
            const result = await query(Iquery, [user_id]);
            return result;
        }catch(error){
            console.error('Error getting internships', error);
            throw new Error('Failed to get internships');
        }
    }

    matchSkill = async(id) => {
        const Iquery=`SELECT i.*, COUNT(isk.skill_id) AS matched_skills_count
        FROM internships i
        JOIN internship_skill isk ON i.id = isk.internship_id
        JOIN user_skill us ON isk.skill_id = us.skill_id
        WHERE us.user_id = $1
        GROUP BY i.id
        ORDER BY matched_skills_count DESC;
                
 `
        try{
            const result = await query(Iquery, [id]);
            return result;
        }catch(err){
            console.error('Error getting internships', err);
            throw new Error('Failed to get internships');
        }
    }

    internshipEmp = async(id) => {
        const Iquery=`
        SELECT i.*, c.name AS company_name, c.location AS company_location
        FROM internships i
        JOIN company c ON i.company_id = c.id
        JOIN user_info u ON c.user_id = u.user_id
        WHERE u.user_id = $1 ORDER BY i.createdat DESC;
        `
        try{
            const result = await query(Iquery, [id]);
            return result;
        }catch(err){
            console.error('Error getting internships', err);
            throw new Error('Failed to get internships');
        }
    }


    updateInternship = async(id , title, description, company_id, last_date, min_salary, max_salary)=>{
        const updateQuery = 
       `
       UPDATE internships
        SET
            title = CASE WHEN $2 IS DISTINCT FROM title THEN $2 ELSE title END,
            description = CASE WHEN $3 IS DISTINCT FROM description THEN $3 ELSE description END,
            company_id = CASE WHEN $4 IS DISTINCT FROM company_id THEN $4 ELSE company_id END,
            last_date = CASE WHEN $5 IS DISTINCT FROM last_date THEN $5 ELSE last_date END,
            min_salary = CASE WHEN $6 IS DISTINCT FROM min_salary THEN $6 ELSE min_salary END,
            max_salary = CASE WHEN $7 IS DISTINCT FROM max_salary THEN $7 ELSE max_salary END
        WHERE id = $1;
`

        try{
            const result = await query (updateQuery, [id, title, description, company_id, last_date, min_salary, max_salary]);
           return result;
        }catch(error){
            console.error('Error updating internship', error);
            throw new Error('Failed to update internship');
        }
    }

    deleteInternship = async( id ) => {
        const deleteQuery = 
        `
        DELETE FROM internships WHERE id = $1; 
        `
        try{
            const result = await query(deleteQuery, [id])
        }catch(error){
            console.error('Error deleting internship', error);
            throw new Error('Failed to delete internship');
        }
    }

    getByCompany = async(id) => {
        const Iquery = `SELECT internships.*
        FROM internships
        JOIN company ON internships.company_id = company.id
        WHERE company.id = $1
        ORDER BY internships.createdat DESC;
    `
    try{
        const result = await query(Iquery, [id]);
        return result;
    }catch(error){
        console.error('Error deleting internship', error);
        throw new Error('Failed to delete internship');
    }

    }

    filterInternships= async(internship_id, filter) => {
        const Iquery = `SELECT 
        u.first_name,
        u.last_name,
        CASE ia.status
            WHEN 'p' THEN 'Pending'
            WHEN 's' THEN 'Approved'
            WHEN 'r' THEN 'Rejected'
            ELSE 'Unknown'
        END AS status_text,
        ia.apply_date,
        p.contact_mail
    FROM 
        internship_apply AS ia
    JOIN 
        user_info AS u ON ia.user_id = u.user_id
    LEFT JOIN 
        profile AS p ON ia.user_id = p.user_id
    WHERE 
        ia.internship_id = $1
        AND ia.status = $2;`
        
        try{
            const result = await query(Iquery, [internship_id, filter]);
            return result;
        }catch(error){
            console.error('Error deleting internship', error);
            throw new Error('Failed to delete internship');
        }

    }

    approveApplication = async (internship_id, user_id) => {
        const Iquery = `
            UPDATE internship_apply
            SET status = 's'
            WHERE internship_id = $1 AND user_id = $2;
        `;
        try {
            const result = await query(Iquery, [internship_id, user_id]);
            return result;
        } catch (error) {
            console.error('Error approving application:', error);
            throw new Error('Failed to approve application');
        }
    };
    
    rejectApplication = async (internship_id, user_id) => {
        const Iquery = `
            UPDATE internship_apply
            SET status = 'r'
            WHERE internship_id = $1 AND user_id = $2;
        `;
        try {
            const result = await query(Iquery, [internship_id, user_id]);
            return result;
        } catch (error) {
            console.error('Error rejecting application:', error);
            throw new Error('Failed to reject application');
        }
    };

    pendingApplication = async (internship_id, user_id) => {
        const Iquery = `
            UPDATE internship_apply
            SET status = 'p'
            WHERE internship_id = $1 AND user_id = $2;
        `;
        try {
            const result = await query(Iquery, [internship_id, user_id]);
            return result;
        } catch (error) {
            console.error('Error rejecting application:', error);
            throw new Error('Failed to reject application');
        }
    };

    getInternSkills = async(id) => {
        const Query = `SELECT s.name, s.id, s.isLang
        FROM internship_skill AS isk
        JOIN skills AS s ON isk.skill_id = s.id
        WHERE isk.internship_id = $1;`
        try {
            const result = await query(Query, [id]);
            return result;
        } catch (error) {
            console.error('Error rejecting application:', error);
            throw new Error('Failed to reject application');
        }
    }
    

}

module.exports = new Internship;