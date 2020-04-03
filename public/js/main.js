// Toggle Switch
const wrapper = document.querySelector('.wrapper');
const para = document.querySelector('p')

wrapper.addEventListener('change', function (e) {
    if (e.target.checked) {
        para.classList.add('morning');
        para.textContent = 'Morning, Sunshine!';
        $('html').removeClass('dark');
    } else {
        para.classList.remove('morning');
        para.textContent = 'Good Night!';
        $('html').addClass('dark');
    }
})

let covid;
let news = {};
$.get({
    url: '/covid',
    success: (data) => {
        covid = data.data;
        let countries = data.countries;
        // renderMaps(covid);

        let whenCalls = ``

        let rn = Math.floor(Math.random() * 10); 
        for (let i in countries) {
            whenCalls += `
                        $.get({
                            url: "/news?country=${countries[i]}",
                            success: (data) => {
                                try{
                                    news["${countries[i]}"] = {img: data[${rn}].urlToImage, desc:data[${rn}].description};
                                }catch(e){
                                    news["${countries[i]}"] = "";
                                }
                            }
                        }),`
        }

        whenCalls = whenCalls.slice(0, -1);
        // console.log(whenCalls);

        $.when(
            eval(whenCalls)
        ).then(() => {
            renderMaps(covid, news);
        });

    }
});

function renderMaps(covid) {
    // console.log(covid, news);
    console.log("------------------------------------");
    console.log(covid);
    console.log("------------------------------------");
    console.log(news);
    console.log("------------------------------------");
    
    for (let i = 1; i < covid.length - 1; i++) {
        console.log(covid[i]); 
        covid[i][2] = `<div class="tool-top-outer"><h5>Infected: ${covid[i][1]}</h5>`;
        covid[i][2] += `<div class="news-image" style="background-image:url(${news[covid[i][0]].img});"></div>`;
        covid[i][2] += `<p>${news[covid[i][0]].desc}</p></div>`;
    }

    google.charts.load('current', {
        'packages': ['geochart'],
        // Note: you will need to get a mapsApiKey for your project.
        // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    });
    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {
        $('.titles img').fadeOut(); 
        var data = google.visualization.arrayToDataTable(covid);

        let colors = []; 
        function hslToHex(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            let r, g, b;
            if (s === 0) {
                r = g = b = l; // achromatic
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            const toHex = x => {
                const hex = Math.round(x * 255).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }


        // hsl(120, 92%, 69%)
        for (let i = 68; i <= 355; i+=0.5) {
            colors.push(hslToHex(i, 92, 69));
        }

        var options = {};
        // options['region'] = 'US';
        // options['resolution'] = 'provinces';
        options['colorAxis'] = {
            minValue: 100,
            maxValue: 100000,
            colors: colors
        };
        // options['backgroundColor'] = '#FFFFFF';
        // options['datalessRegionColor'] = '#E5E5E5';
        options.tooltip = {
            isHtml: true
        };
        options.legend = 'none'; 

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
    }
}