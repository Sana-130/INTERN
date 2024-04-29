const { query } = require('../db/db-service');

class userProfile {
    createProfile = async(userId) => {
        const insertProfileQuery = `
            INSERT INTO profile (user_id)
            VALUES ($1);
        `;

        try{
            const result = await query(insertProfileQuery, [userId]);
            return result;
        }catch(err){
            console.error('Error creating profile:', err);
            throw new Error('Failed to create profile');
        }
    }

    getProfile = async(user_id) => {
        const getQuery = `SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        p.about,
        p.institution_name,
        p.graduation_year,
        p.course_name,
        p.site_link,
        p.location,
        p.contact_mail,
        p.linkedin_profile_link,
        JSON_AGG(JSON_BUILD_OBJECT('name', s.name, 'isLang', s.islang, 'score', us.score)) AS skills,
        ARRAY(
            SELECT 
                repo_id
            FROM 
                (
                    SELECT 
                        pr.repo_id
                    FROM 
                        project AS pr
                    WHERE 
                        pr.user_id = $1
                    LIMIT 3
                ) AS subquery
        ) AS repo_ids
    FROM 
        user_info AS u
    LEFT JOIN 
        profile AS p ON u.user_id = p.user_id
    LEFT JOIN 
        user_skill AS us ON u.user_id = us.user_id
    LEFT JOIN 
        skills AS s ON us.skill_id = s.id
    WHERE 
        u.user_id = $1
    GROUP BY 
        u.user_id,
        u.first_name,
        u.last_name,
        p.about,
        p.institution_name,
        p.graduation_year,
        p.course_name,
        p.site_link,
        p.location,
        p.contact_mail,
        p.linkedin_profile_link;
    `
        try{
            const result = await query(getQuery, [user_id]);
            return result;
        }catch(err){
            console.error('Error retreiveing profile data:', err);
            throw new Error('Failed to get profile');
        }
    }

    updateProfile = async (userId, about, institutionName, graduationYear, courseName, siteLink, location, contactMail, linkedinProfileLink ) => {
       // console.log(userId, about, institutionName, currentYear, expGradYear, courseName);
       /* const updateQuery = `
        UPDATE profile
        SET
            about = CASE WHEN $2 IS DISTINCT FROM coursename AND $2 IS NOT NULL THEN $2 ELSE coursename END,
            institutionname = CASE WHEN $3 IS DISTINCT FROM institutionname AND $3 IS NOT NULL THEN $3 ELSE institutionname END,
            currentyear = CASE WHEN $4 IS DISTINCT FROM currentyear AND $4 IS NOT NULL THEN $4 ELSE currentyear END,
            expgradyear = CASE WHEN $5 IS DISTINCT FROM expgradyear AND $5 IS NOT NULL THEN $5 ELSE expgradyear END,
            coursename = CASE WHEN $6 IS DISTINCT FROM coursename AND $6 IS NOT NULL THEN $6 ELSE coursename END
        WHERE userid = $1
        RETURNING userid;
        `;*/

        const updateQuery = `
            UPDATE profile
            SET
                about = CASE WHEN $2 IS DISTINCT FROM about THEN $2 ELSE about END,
                institution_name = CASE WHEN $3 IS DISTINCT FROM institution_name THEN $3 ELSE institution_name END,
                graduation_year = CASE WHEN $4 IS DISTINCT FROM graduation_year THEN $4 ELSE graduation_year END,
                course_name = CASE WHEN $5 IS DISTINCT FROM course_name THEN $5 ELSE course_name END,
                site_link = CASE WHEN $6 IS DISTINCT FROM site_link THEN $6 ELSE site_link END,
                location = CASE WHEN $7 IS DISTINCT FROM location THEN $7 ELSE location END,
                contact_mail = CASE WHEN $8 IS DISTINCT FROM contact_mail THEN $8 ELSE contact_mail END,
                linkedin_profile_link = CASE WHEN $9 IS DISTINCT FROM linkedin_profile_link THEN $9 ELSE linkedin_profile_link END
            WHERE user_id = $1
            RETURNING user_id;
        `;

    
        try {
            const result = await query(updateQuery, [userId, about, institutionName, graduationYear, courseName, siteLink, location, contactMail, linkedinProfileLink]);
            //console.log(result);
            return result;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update user profile');
        }
    }

    getProjectInfo = async(id) => {
        const Query = `SELECT
        pr.repo_id,
        JSON_AGG(JSON_BUILD_OBJECT(
            'score', ps.score,
            'skill_name', s.name
        )) AS skills
    FROM
        project AS pr
    JOIN
        project_skill AS ps ON pr.repo_id = ps.project_id
    JOIN
        skills AS s ON ps.skill_id = s.id
    WHERE
        pr.user_id = $1
    GROUP BY
        pr.repo_id;
    `
    
        try{
            const result = await query(Query, [id]);
            return result;
        }catch(err){
            console.error('Error retreiveing profile data:', err);
            throw new Error('Failed to get profile');
        }
    }

    getNotLangSkills = async(id) => {
        const Query = `
        SELECT 
            s.id AS skill_id,
            s.name AS skill_name,
            us.score
        FROM 
            user_skill AS us
        JOIN 
            skills AS s ON us.skill_id = s.id
        WHERE 
            us.user_id = $1
            AND s.isLang = false;
        `
        try{
            const result = await query(Query, [id]);
            return result;
        }catch(err){
            console.error('Error retreiveing profile data:', err);
            throw new Error('Failed to get profile');
        }
    }
}

module.exports = new userProfile;