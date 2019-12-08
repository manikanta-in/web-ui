var express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser');
var config = require('./config')
const axios = require('axios');

router.get('/api/users/user', function(req, res) {
  console.log(`${config.service}/api/users/user`)
  axios.get(`${config.service}/api/users/user`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

router.post('/api/users/user', function(req, res) {
  console.log(req.body)
  axios.post(`${config.service}/api/users/user`,req.body)
    .then(response => {
      console.log("user added");
      res.send(response.data);
    })
    .catch(error => {
      console.log("user added error");
      console.log(error);
      res.send(error);
    });
});


router.put('/api/users/user', function(req, res) {
  axios.put(`${config.service}/api/users/user`,req.body)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});


router.delete('/api/users/user/:id', function(req, res) {
  axios.delete(`${config.service}/api/users/user/${req.params.id}`,req.body)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});


module.exports = router;
