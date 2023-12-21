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

    updateProfile = async (userId, { about, institutionName, currentYear, expGradYear, courseName }) => {
        const updateQuery = `
            UPDATE profile
            SET
                institution_name = COALESCE(NULLIF(E'${institutionName}', E''), institution_name),
                current_year = COALESCE(NULLIF(E'${currentYear}', E''), current_year),
                exp_grad_year = COALESCE(NULLIF(E'${expGradYear}', E''), exp_grad_year),
                course_name = COALESCE(NULLIF(E'${courseName}', E''), course_name),
                about = COALESCE(NULLIF(E'${about}', E''), about)
            WHERE user_id = $1
            RETURNING user_id;
        `;
    
        try {
            const result = await query(updateQuery, [userId]);
            return result;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update user profile');
        }
    }



}

module.exports = userProfile;