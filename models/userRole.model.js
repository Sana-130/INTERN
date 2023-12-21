const { query } = require('../db/db-service');

class userRoleModel {

    getIdByRole = async (role) => {
        const selectQuery = `
            SELECT id FROM user_role WHERE role = $1;
        `;

        try {
            const result = await query(selectQuery, [role]);
            return result;
        } catch (error) {
            console.error('Error retrieving role id:', error);
            throw new Error('Failed to retrieve role id');
        }
    }
}

module.exports = userRoleModel;