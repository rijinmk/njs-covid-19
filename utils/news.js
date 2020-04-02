const request = require('request');
const fs = require('fs'); 
// const sleep = require('sleep'); 
// https://newsapi.org/v2/everything?q=uae+coronavirus&apiKey=58d998d42a354f8e99deca813afa69aa&language=en

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

let news = async (country, callback) => {
    // sleep.sleep(0.2); 
    await sleep(700); 
    let date = new Date(); 
    let year = date.getFullYear(); 
    let month = date.getMonth() + 1; 
    let day = date.getDate();

    let url = `
        https://newsapi.org/v2/everything
        ?q=${country}+coronavirus
        &language=en
        &apiKey=58d998d42a354f8e99deca813afa69aa
    `.replace(/\s/g, '')

    let country_news_folder = `${__dirname}/news/${country}`; 
    let country_news_today_file = `${__dirname}/news/${country}/${country}_${year}-${month}-${day}.json`;

    if (!fs.existsSync(country_news_folder)){
        console.log(`Folder doesn't exist for ${country}`); 
        console.log('Creating folder...');
        fs.mkdirSync(country_news_folder);
    }

    console.log(`Folder does exist, Checking if today's news for ${country} exists`); 
    if (!fs.existsSync(country_news_today_file)){
        console.log(`Todays news for ${country} doesn't exist.`); 
        console.log(`Requesting NewsAPI for ${country} news`); 
        request({ url: url, json: true}, (error, data) => {
            if(!error){ 
                let todays_covid_news = data.body.articles; 
                fs.writeFileSync(country_news_today_file, JSON.stringify(todays_covid_news));
                callback(null, todays_covid_news);
            }else{
                callback(error, null);
            }
        }); 
    }else{
        console.log(`File exists, Sending the JSON file`);
        let country_news = fs.readFileSync(country_news_today_file).toString();
        callback(null, JSON.parse(country_news)); 
    }

}

module.exports = news; 