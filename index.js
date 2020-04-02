const express = require('express');
const hbs = require('hbs');
const covid = require('./utils/covid'); 
const news = require('./utils/news');
var cors = require('cors');

const app = express();
const PORT = 3000 || process.env.PORT; 

// Public folder
app.use(express.static('public'));
app.use(cors());

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

app.get('/news', function(req, res){
    let country = req.query.country; 
    if(country){
        news(country, (error, data) => {
            res.send(data);
        }); 
    }else{
        res.send({
            error: "Please provide a country."
        }); 
    }
});

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});