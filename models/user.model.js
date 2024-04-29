const { query } = require('../db/db-service');

class userModel {
    createUser = async ({firstName, lastName, password, email, usertypeId, active}) =>{
        const insertQuery = `
            INSERT INTO profile (first_name, last_name, password, email, usertype_id, active)
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

    getStudentByName = async(input) => {
        const UserQuery = `
        SELECT u.first_name, u.last_name, u.email, u.createdat, u.active
            FROM user_info u
            JOIN usertype ut ON u.usertype_id = ut.id
            WHERE ut.role = 'student'
            AND u.first_name = $1;
    `;

    try {
        const result = await query(UserQuery, [input]);
        return result;
    } catch (error) {
        console.error('Error getting user:', error);
        throw new Error('Failed getting user');
    }
    }

    getEmployerByName = async(input) => {
        const UserQuery = `
        SELECT u.first_name, u.last_name, u.email, u.createdat, u.active
            FROM user_info u
            JOIN usertype ut ON u.usertype_id = ut.id
            WHERE ut.role = 'employer'
            AND u.first_name = $1;
    `;

    try {
        const result = await query(UserQuery, [input]);
        return result;
    } catch (error) {
        console.error('Error getting user:', error);
        throw new Error('Failed getting user');
    }
    }

    getUserEById = async(input) => {
        const UserQuery = `
        SELECT u.user_id, u.first_name, u.last_name, u.email, u.createdat, u.active, u.github_userid
        FROM user_info u
        JOIN usertype ut ON u.usertype_id = ut.id
        WHERE ut.role = 'employer'
        AND u.user_id = $1;
    `;

    try {
        const result = await query(UserQuery, [input]);
        return result;
    } catch (error) {
        console.error('Error getting user:', error);
        throw new Error('Failed getting user');
    }
    }

    getUserSById = async(input) => {
        const UserQuery = `
        SELECT u.user_id, u.first_name, u.last_name, u.email, u.createdat, u.active, u.github_userid
        FROM user_info u
        JOIN usertype ut ON u.usertype_id = ut.id
        WHERE ut.role = 'student'
        AND u.user_id = $1;
    `;

    try {
        const result = await query(UserQuery, [input]);
        return result;
    } catch (error) {
        console.error('Error getting user:', error);
        throw new Error('Failed getting user');
    }
    }

    //search by id

    //search by name for both students and employer


    getAccessToken = async (userId) => {
        const getQuery = `SELECT accesstoken FROM user_info WHERE user_id = $1`;
        try {
            const result = await query(getQuery, [userId]);
            if (result.length) {
                const { accesstoken } = result[0]; // Assuming you're expecting one row
                return accesstoken;
            }
        } catch (error) {
            console.error('Error retreiveing access token:', error);
            throw new Error('Failed to  retreive access token:');
        }
    }

    getNames = async(id) => {
        const Query = `
        SELECT first_name, last_name FROM user_info WHERE user_id = $1
        `
        try {
            const result = await query(Query, [id]);
            if (result.length) {
                return result;
            }
        } catch (error) {
            console.error('Error retreiveing access token:', error);
            throw new Error('Failed to  retreive access token:');
        }
    }

    editNames = async( id , first_name, last_name)=>{
        const Query = `
        UPDATE user_info
        SET
            first_name = $2,
            last_name = $3
        WHERE
            user_id = $1;

        `
        try {
            const result = await query(Query, [id, first_name, last_name]);
            return result;
        } catch (error) {
            console.error('Error retreiveing access token:', error);
            throw new Error('Failed to  retreive access token:');
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