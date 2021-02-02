const { static } = require('express');
const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');





const session = require('express-session');
app.use(session({secret: 'sh', saveUninitialized: true,resave: true}));





const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended : true }));

app.use(express.json());
app.use('/', routes);
app.use(express.static('public'));
app.use(express.static('uploads'));






app.listen(port, () => {
  console.log(`servern lyssnar på http://localhost:${port}`)
})
