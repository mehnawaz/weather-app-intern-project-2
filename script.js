//api key
const apikey = "861947e0086707cfab114bfcc8053b1b";

const h = document.querySelector('.humidity');
const w = document.querySelector('.wind');
const p = document.querySelector('.pressure');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const weapp = document.getElementsByClassName('weather-app')


window.addEventListener("load", () => {
    if (navigator.geolocation) {        
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`
            
            fetch(url).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data);
                console.log(new Date().getTime())
                var dat = new Date(data.dt)
                console.log(dat.toLocaleString(undefined, 'Asia/Kolkata'))
                console.log(new Date().getMinutes())
                weatherReport(data);
            })
        })
    }
})

//time
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

//Search bar-----
function searchByCity() {
    var place = document.getElementById('input').value;
    var urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

    fetch(urlsearch).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data);
        weatherReport(data);
    })
    document.getElementById('input').value = '';
}


//Weather report
function weatherReport(data) {
    var urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    fetch(urlcast).then((res) => {
        return res.json();
    }).then((forecast) => {
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast)

        console.log(data);
        document.getElementById('city').innerText = data.name + ', ' + data.sys.country;
        console.log(data.name, data.sys.country);

        console.log(Math.floor(data.main.temp - 273));
        document.getElementById('temperature').innerText = Math.floor(data.main.temp - 273) + '°';

        h.innerHTML = data.main.humidity + "%"
        w.innerHTML = data.wind.speed + "km/h"
        p.innerHTML = data.main.pressure + "hPa"

        //change icon

        document.getElementById('clouds').innerText = data.weather[0].description;
        console.log(data.weather[0].description)

        let icon1 = data.weather[0].icon;
        let iconurl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
        document.getElementById('img').src = iconurl


        //change bg

        const status = data.weather[0].description;
        if (status == "smoke") {
            weapp[0].style.backgroundImage = 'url(image/smoke.jpg)'
        } else if (status == "fog") {
            weapp[0].style.backgroundImage = 'url(image/fog.jpg)'
        } else if (status == 'broken clouds') {
            weapp[0].style.backgroundImage = 'url(image/broken_clouds.jpg)'
        } else if (status == 'clear sky') {
            weapp[0].style.backgroundImage = 'url(image/clear.jpg)'
        } else if (status == 'light rain') {
            weapp[0].style.backgroundImage = 'url(image/rainy.jpg)'
        } else if (status == 'overcast clouds') {
            weapp[0].style.backgroundImage = 'url(image/overcast_clouds.jpg)';
        } else if (status == 'haze') {
            weapp[0].style.backgroundImage = 'url(image/haze.jpg)'
        } else if (status == 'scattered clouds') {
            weapp[0].style.backgroundImage = 'url(image/scattered_clouds.jpg)'
        } else if (status == 'mist') {
            weapp[0].style.backgroundImage = 'url(image/mist.jpg)'
        } else if (status == 'cloudy') {
            weapp[0].style.backgroundImage = 'url(image/cloudy.jpg)'
        } else {
            weapp[0].style.backgroundImage = 'url(image/bg.jpg)';
        }
    })
}

//Upcoming forecast-----
function hourForecast(forecast) {
    document.querySelector('.templist').innerHTML = ''
    for (let i = 0; i < 5; i++) {
        var date = new Date(forecast.list[i].dt * 1000)
        console.log((date.toLocaleTimeString(undefined, 'Asia/Kolkata')).replace(':00', ''))

        let hourR = document.createElement('div');
        hourR.setAttribute('class', 'next');

        let div = document.createElement('div');
        let time = document.createElement('p');
        time.setAttribute('class', 'time')
        time.innerText = (date.toLocaleTimeString(undefined, 'Asia/Kolkata')).replace(':00', '');

        let temp = document.createElement('p');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273)) + ' °C';

        div.appendChild(time)
        div.appendChild(temp)

        let desc = document.createElement('p');
        desc.setAttribute('class', 'desc')
        desc.innerText = forecast.list[i].weather[0].description;
        desc.style.color = "white";
        
        hourR.appendChild(div);
        hourR.appendChild(desc)
        document.querySelector('.templist').appendChild(hourR);
    }
}

//Other days forecast----------

function dayForecast(forecast) {
    document.querySelector('.weekF').innerHTML = ''
    for (let i = 0; i < forecast.list.length; i += 8) {
        console.log(forecast.list[i]);
        let div = document.createElement('div');
        div.setAttribute('class', 'dayF');

        let day = document.createElement('p');
        day.setAttribute('class', 'date')
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(undefined, 'Asia/Kolkata');
        div.appendChild(day);

        let temp = document.createElement('p');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273)) + ' °C';
        div.appendChild(temp)

        let description = document.createElement('p');
        description.setAttribute('class', 'desc')
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div)
    }
}




