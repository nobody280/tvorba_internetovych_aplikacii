import express from 'express';
var router = express.Router();


/* GET home page. */
router.get('/', (req, res) => {
  res.send('Welcome to the API!'); 
});

export default router;