const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const {authorize} = require("../middleware/authorize");
const multer = require("multer");

//create the company profile
router.post("/create", async(req, res)=>{
    try{
    const {name, location, date, description} = req.body;

    if(!name || !location || !date || !description){
        return res.status(400).json({error : 'Missing required fields'});
    }

    let newPage = await pool.query("INSERT INTO Company (Company_name, description ,location, established_date, createdBy) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, location, date, req.user.user_id]);

    return res.status(200).json({newPage});
    }catch(err){
        res.status(500).json({sucess : false, error: 'Internal server error'});
    }
});

router.get('/:companyId/edit', async (req, res) => {
    try {
      const companyId = req.params.companyId;
      const company = await pool.query('SELECT * FROM company WHERE compId = $1 and createdBy = $2', [companyId, req.user.user_id]);
  
      if (!company.rows[0]) {
        return res.status(404).json({ success: false, error: 'Company not found' });
      }
  
      res.status(200).json({ success: true, company: company.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

router.put("/:companyId/edit", async(req, res)=>{
    try{
        const companyId = req.params.companyId;
        const {name, location, date, description} = req.body;

        if(!name || !location || !date || !description){
            return res.status(400).json({error : 'Missing required fields'});
        }

        let Page = await pool.query("SELECT * FROM Company WHERE compId=$1 AND createdBy = $2", [companyId, req.user.user_id]);
        if(!Page.rows[0]){
            return res.status(403).json({success : false, error:'Authorized'});
        }
        await pool.query(
            'UPDATE company SET name = $1, location=$2 , date=$3 , description = $4 WHERE id = $3',
            [name, location, date, description]
        );
        return res.status(200).json({sucess:true , message:'Company updated successfully'});
    }catch(err){
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

//create a internship post - if there's a company, by default the company name should be given in the job field. 

//company profile
router.get("/:companyId", async(req, res) => {
    try{
        const PageId = req.params.companyId;
        const Page = await pool.query('SELECT * FROM Company WHERE CompId = $1', [PageId]);
        if(!Page.rows[0]){
            return res.status(403).json({success:false , error:"company not found"});
        }
        return res.status(200).json({sucess: true , company : Page.rows[0] });
    }catch{
        res.status(500).json({ success: false, error: 'Internal Server Error' });  
    }
})

//posting  internship
router.post("/:companyId/internship/add", async(req, res) => {
    try{
        const {name, description, lastDate, skills} = req.body;
        const post = await pool.query("INSERT INTO Internships (postedBy_id, company_id ,established_date, job_description, domain , skills, location, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
            req.user.user_id,

        ]);
    }catch(err){
        console.log(err);
    }
});

//editing internship post
router.put("/:companyId/internship/:internPostId/edit", async(req, res) =>{
    try{
        const {name, description, lastDate, skills} = req.body;
    }catch(err){
        console.log(err);
    }
});

//getting current internship post
router.get("/:companyId/internship/:internPostId/edit", async(req, res) => {
    try{
        const postId = req.params.internPostId;
        const post = await pool.query('SELECT * FROM Internship WHERE id = $1', [postId]);
    }catch(err){

    }
});

//get all internship posted by a company
router.get("/:companyId/internships/all", async(req, res) => {
    try{
        const compId = req.params.companyId;
        const Page = await pool.query('SELECT * FROM Internship WHERE createdby_id = $1', [compId]);
    }catch(err){
        
    }
});
//applicants of a job
router.get("/:companyId/internship/:internPostId/applicants" , async(req, res) => {
    try{
        //get all applicants of the job to sort them
        
    }catch(err){

    }
});

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Set the filename to be unique
    },
});
const upload = multer({storage: storage});

router.post('/upload', upload.single('image'), (req, res)=>{
    if(!req.file){
        return res.status(400).json({error : 'No image provided'});
    }
    const {filename, size, mimetype} = req.file;
    res.json({filename, size, mimetype});
});


router.post("/posting", authorize, async(req, res) =>{
    const {email, name, password } = req.body;

});

module.exports = router;