const request = require('request');


let covid = (callback) => {
    request({ url: "https://pomber.github.io/covid19/timeseries.json", json: true}, (error, data) => {
        // console.log(data); 
        if(!error){
            let covid = data.body;
            let visualize_data = [['Country', 'Infected', { role: 'tooltip', p: { html: true } }]]; 
            let countries = Object.keys(covid); 
            for(i in covid){
                let current_situation = covid[i][covid[i].length - 1]; 
                visualize_data.push([i, current_situation.confirmed, '<b>News<b>']);
            }
            callback(null, { data: visualize_data, countries}); 
        }else{
            callback(error, null); 
        }
    }); 
}

module.exports = covid; 