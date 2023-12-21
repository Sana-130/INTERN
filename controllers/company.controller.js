const { pool }= require('../db/db-service');

const createCompany = async (req, res) => {
  try {
    const { name, location, date, description } = req.body;

    if (!name || !location || !date || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let newPage = await pool.query(
      'INSERT INTO Company (Company_name, description, location, established_date, createdBy) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, location, date, req.user.user_id]
    );

    return res.status(200).json({ newPage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const editCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const { name, location, date, description } = req.body;

    if (!name || !location || !date || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let Page = await pool.query(
      'SELECT * FROM Company WHERE compId=$1 AND createdBy = $2',
      [companyId, req.user.user_id]
    );

    if (!Page.rows[0]) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await pool.query(
      'UPDATE company SET name = $1, location=$2 , date=$3 , description = $4 WHERE id = $5',
      [name, location, date, description, companyId]
    );

    return res.status(200).json({ success: true, message: 'Company updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const company = await pool.query('SELECT * FROM company WHERE compId = $1', [companyId]);

    if (!company.rows[0]) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    res.status(200).json({ success: true, company: company.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
    createCompany,
    editCompany,
    getCompanyById
}
