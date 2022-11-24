const envConf = require('dotenv').config({ debug: process.env.DEBUG });

if (envConf.error) {
  throw envConf.error
}
const app = require('express')();
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

const { body } = require('express-validator');
const fs = require('fs');


require('./www/database/db').startDB(app);

//BOOTSTRAP ROUTES START
const routesPath = './src/routes';
fs.readdirSync(routesPath).forEach(function (file) {
  if (~file.indexOf('.js')) {
    let route = require(routesPath + '/' + file);
    console.log(`current file : ${file} route registered : ${JSON.stringify(route)}`);
    route.setRouter(app);
  }
});
//BOOTSTRAP ROUTES ENDuserController