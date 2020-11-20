//////////////////////////// VARIABLES ////////////////////////////////////////


let cityName = "";
let cityLong = 0;
let cityLa = 0;
let temperature = 0;
let humidity = 0;
let windSpeed = 0;
let uvIndex = 0;
let fiveDays = "";
let apiKey = "&appid=72b683573979f675e34ed4c06ed32896"
let weatherPrefix = "http://api.openweathermap.org/data/2.5/weather?units=imperial&q="
let fiveDaysPrefix = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q="
let uvPrefix = "http://api.openweathermap.org/data/2.5/uvi?"
let oneCallPrefix = "http://api.openweathermap.org/data/2.5/onecall?"

let searchHistory = {};
const apikey = "&appid=72b683573979f675e34ed4c06ed32896";

let iconName = '';


//////////////////////////// FUNCTION ////////////////////////////////////////


function renderSearchHistory () {
    var searchObj = JSON.parse(localStorage.getItem('searchHistory'));
    if (searchObj) {
        for (var i = 0; i < searchObj.length; ++i) {
          $(`#row${i}`).html(`<td><button class="btn btn-link">${searchObj[i].searchString}</button></td>`);
        }
    }    

}

function initLocalStorage () {
    localStorage.setItem('searchHistory', '[]');
}

function saveLocalStorage () {
    localStorage.setItem('searchHistory', JSON.stringify(searchObj));

}

function getWeather (cityName) {

    console.log(cityName);

    // using cityName to temp humidity windspeed and latitude and longtitude

    var urlWeatherTest = weatherPrefix + cityName + apikey;

    console.log("urlWeatherTest =" + urlWeatherTest);

    $.ajax({
        url: weatherPrefix + cityName + apikey,
       
        method: "GET",
    })
    .then(function(response) {

        console.log("weather =" + response);

        cityName = response.name;
        console.log("cityName" + cityName);

        cityLong = response.coord.lon;
        console.log("cityLong=" + cityLong);
        
        cityLa = response.coord.lat;
        console.log("cityLa=" + cityLa);
        
        temperature = response.main.temp;
        console.log("temperature=" + temperature);
        
        humidity = response.main.humidity;
        console.log("humidity=" + humidity);
        
        windSpeed = response.wind.speed;
        console.log("windSpeed=" + windSpeed);
        
        iconName = response.weather[0].icon;
        console.log("iconName=" + iconName);
        

        // since ajax is asynchronous need to move both Uvi and Fivedays request to be after weather to pass the latitute and longtitude value
        // using latitude and lontitude to get uvIndex data

        var urlUviTest = uvPrefix + apikey + "&lat=" + cityLa + "&lon=" + cityLong;
        console.log("urlUviTest =" + urlUviTest);


        $.ajax({

            url: `${uvPrefix + apikey}&lat=${cityLa}&lon=${cityLong}`,
            method: "GET",

        })
        .then(function (response) {

            console.log("uv =" + response);

            uvIndex = response.value;
            console.log("uvIndex=" + uvIndex);


        })


        // var urlFiveDaysTest = fiveDaysPrefix + cityName + apiKey;
        // console.log("urlFiveDaysTest =" + urlFiveDaysTest);

        var urlOneCallTest = oneCallPrefix + apikey + "&lat=" + cityLa + "&lon=" + cityLong + "&exclude=hourly,minutely";
        console.log("urlOneCallTest =" + urlOneCallTest);

        $.ajax({

            // url: fiveDaysPrefix + cityName + apiKey,
            url: urlOneCallTest,
            method: "GET"

        })
        .then(function (response) {

            console.log("fiveDays =" + response);


        })


    })





}


//////////////////////////// EXECUTION ////////////////////////////////////////

// Render search history when load the page
// $(document).ready(() => {
//     // localStorage.clear();
//     renderSearchHistory();
// })

$("#searchBtn").click(function(event) {


    console.log(event);
    event.preventDefault;
    var cityName = $('input').val();
    console.log(cityName);

    // pass cityName to query result
    getWeather(cityName);



})




