const { query } = require('../db/db-service');

class userModel {
    createUser = async ({firstName, lastName, password, email, usertypeId, active}) =>{
        const insertQuery = `
            INSERT INTO user_info (first_name, last_name, password, email, usertype_id, active)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id;
        `;

        try {
            const result = await query(insertQuery, [firstName, lastName, password, email, usertypeId, active]);
           // Assuming user_id is returned as part of the result set
            return result;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

    updateUserPassword = async ({userId, hashedPassword}) => {
        const updatePasswordQuery = `
            UPDATE user_info 
            SET password = $1
            WHERE user_id = $2;
        `;

        try {
            const result = await query(updatePasswordQuery, [hashedPassword, userId]);
            return result;
        } catch (error) {
            console.error('Error updating user password:', error);
            throw new Error('Failed to update user password');
        }
    }    

    activateUser = async (userId) => {
        const activateUserQuery = `
            UPDATE user_info
            SET active = true
            WHERE user_id = $1;
        `;

        try {
            const result = await query(activateUserQuery, [userId]);
            return result;
        } catch (error) {
            console.error('Error activating user:', error);
            throw new Error('Failed to activate user');
        }
    }

  /*  updateUser = async (userId, { password, email, usertypeId, active }) => {
        const updateQuery = `
            UPDATE user_info
            SET
                password = COALESCE(NULLIF(E'${password}', E''), password),
                email = COALESCE(NULLIF(E'${email}', E''), email),
                usertype_id = COALESCE(NULLIF(E'${usertypeId}', E''), usertype_id),
                active = COALESCE(NULLIF(E'${active}', E''), active)
            WHERE user_id = $1
            RETURNING user_id;
        `;

        try {
            const result = await query(updateQuery, [userId]);
            const updatedUserId = result[0].user_id; // Assuming user_id is returned as part of the result set
            return updatedUserId;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update user profile');
        }
    }*/
}

module.exports = new userModel;