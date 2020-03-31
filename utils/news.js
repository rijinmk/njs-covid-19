let request = require('request');

// https://newsapi.org/v2/everything?q=uae+coronavirus&apiKey=58d998d42a354f8e99deca813afa69aa&language=en

let news = (country, callback) => {
    request({ url: `https://newsapi.org/v2/everything?q=${country}+coronavirus&apiKey=58d998d42a354f8e99deca813afa69aa&language=en`, json: true}, () => {
        
    }); 
}