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

    updateProfile = async ({userId, about, institutionName, currentYear, expGradYear, courseName }) => {
       // console.log(userId, about, institutionName, currentYear, expGradYear, courseName);
        const updateQuery = `
        UPDATE profile
        SET
            about = CASE WHEN $2 IS DISTINCT FROM coursename AND $2 IS NOT NULL THEN $2 ELSE coursename END,
            institutionname = CASE WHEN $3 IS DISTINCT FROM institutionname AND $3 IS NOT NULL THEN $3 ELSE institutionname END,
            currentyear = CASE WHEN $4 IS DISTINCT FROM currentyear AND $4 IS NOT NULL THEN $4 ELSE currentyear END,
            expgradyear = CASE WHEN $5 IS DISTINCT FROM expgradyear AND $5 IS NOT NULL THEN $5 ELSE expgradyear END,
            coursename = CASE WHEN $6 IS DISTINCT FROM coursename AND $6 IS NOT NULL THEN $6 ELSE coursename END
        WHERE userid = $1
        RETURNING userid;
        `;
    
        try {
            const result = await query(updateQuery, [userId, about, institutionName, currentYear, expGradYear, courseName]);
            //console.log(result);
            return result;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update user profile');
        }
    }
}

module.exports = new userProfile;