const express = require('express');
const hbs = require('hbs');
const covid = require('./utils/covid'); 

const app = express();
const PORT = 3000 || process.env.PORT; 

// Public folder
app.use(express.static('public'));

// Handlebars setup
app.set('view engine', 'hbs');

app.get('/', function(req, res){
    res.render('index'); 
});

app.get('/covid', function(req, res){
    covid((error, data) => {
        res.send(data); 
    }); 
}); 

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});