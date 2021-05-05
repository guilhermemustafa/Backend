const express = require('express');
const bodyParser = require('body-Parser');

const app = express();


app.use(express.json());

require('./controllers/authControllers')(app);

app.listen(3000, () => console.log('Api on 3000'));
