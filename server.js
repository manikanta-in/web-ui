const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const bodyParser = require('body-parser');
const routes = require('./routes');
const path = require('path');
const app = express();
console.log('app initlizing ...');
app.use(express.static('dist/web-ui'));
app.set('port', process.env.PORT || 3002);
console.log('app started...');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use("/",routes);
app.use(function(req, res, next) {
  if (path.extname(req.path).length > 0) {
    next();
  } else {
    res.sendFile(path.resolve('dist/web-ui/index.html'));
  }
});
console.log(app.get('port'));
server = app.listen(app.get('port'), () =>
  console.log('Server is running on port ' + app.get('port')),
);
server.timeout = 880000;
console.log('server is running');
