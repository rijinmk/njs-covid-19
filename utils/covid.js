const request = require('request');

let covid = (callback) => {
    request({ url: "https://pomber.github.io/covid19/timeseries.json", json: true}, (error, data) => {
        // console.log(data); 
        if(!error){
            let covid = data.body;
            let countries = Object.keys(covid); 
            callback(null, { data: covid, countries}); 
        }else{
            callback(error, null); 
        }
    }); 
}

module.exports = covid; 