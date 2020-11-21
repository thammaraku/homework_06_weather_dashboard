//////////////////////////// VARIABLES ////////////////////////////////////////


var cityName = "";
var country = "";
var cityLong = 0;
var cityLa = 0;
var temperature = 0;
var humidity = 0;
var windSpeed = 0;
var uvIndex = 0;
var fiveDays = "";
var apiKey = "&appid=72b683573979f675e34ed4c06ed32896"
var weatherPrefix = "http://api.openweathermap.org/data/2.5/weather?units=imperial&q="
var fiveDaysPrefix = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q="
var uvPrefix = "http://api.openweathermap.org/data/2.5/uvi?"
var oneCallPrefix = "http://api.openweathermap.org/data/2.5/onecall?"
var iconURL= 'https://openweathermap.org/img/wn/';
var searchHistory = {};
const apikey = "&appid=72b683573979f675e34ed4c06ed32896";

var iconName = '';


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
        error: function(err) {
            alert("The city was not found. Please check your spelling")
            return;
        }
    })
    .then(function(response) {

        console.log("weather =" + response);

        cityName = response.name;
        console.log("cityName" + cityName);

        country = response.sys.country;
        console.log("country" + country);

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

            // url: `${uvPrefix + apikey}&lat=${cityLa}&lon=${cityLong}`,
            url: uvPrefix + apikey + "&lat=" + cityLa + "&lon=" + cityLong,
            method: "GET",

        })
        .then(function (response) {

            console.log("uv =" + response);

            uvIndex = response.value;
            console.log("uvIndex=" + uvIndex);


        })

  

        // user cityName to get fiveDays forecase
        var urlFiveDaysTest = fiveDaysPrefix + cityName + apiKey;
        console.log("urlFiveDaysTest =" + urlFiveDaysTest);

        // var urlOneCallTest = oneCallPrefix + apikey + "&lat=" + cityLa + "&lon=" + cityLong + "&exclude=hourly,minutely";
        // console.log("urlOneCallTest =" + urlOneCallTest);

        $.ajax({

            url: fiveDaysPrefix + cityName + apiKey,
            // url: urlOneCallTest,
            method: "GET"

        })
        .then(function (response) {

            console.log("fiveDays =" + response);
            return getFiveDaysData(response);


        })


    })

    .then(function() {

        console.log("cityName=" + cityName + "," + country);
        console.log("cityName=" + humidity + "," + country);

        currentWeather(cityName);

    })

}

function convertUnixTime (unixTime) {

    return moment(unixTime).format('MM/DD/YYYY');

}

function currentWeather (cityName) {

    // console.log("cityName currentWeather=" + cityName + "," + country);

    $('#cityName').text(cityName + ',' + country + ' ' + '(' + convertUnixTime(Date.now()) + ')');
    $('#weatherIcon').attr('src', iconURL + iconName + '.png');
    $('#temperature').text('Temperature: ' + temperature + ' ' + String.fromCharCode(176) + 'F');
    $('#humidity').text('Humidity: ' + humidity + '%');
    $('#windSpeed').text('Wind Speed: ' + windSpeed + ' MPH');
    $('#uvIndex').text('UV Index: ' + uvIndex);  



}

function getFiveDaysData(response) {

    console.log("response fiveDays forcast =" + response);
  
    var fiveDaysArray = response.list;
    console.log("fiveDaysArray =" + fiveDaysArray);
  
    var dayNumber = 1;
    for(var i = 0; i < fiveDaysArray.length; i+=8) {
      $(`#day${dayNumber}`).find('h5').text(convertUnixTime(fiveDaysArray[i].dt * 1000));
      $(`#day${dayNumber}`).find('.weatherIcon').attr('src', iconURL + fiveDaysArray[i].weather[0].icon + '.png');
      $(`#day${dayNumber}`).find('.tempText').text('Temperature:' + fiveDaysArray[i].main.temp);
      $(`#day${dayNumber}`).find('.humidityText').text('Humidity: ' + fiveDaysArray[i].main.humidity + '%');
  
      ++ dayNumber;
    }
} 





//////////////////////////// EXECUTION ////////////////////////////////////////

// Render search history when load the page
// $(document).ready(() => {
//     // localStorage.clear();
//     renderSearchHistory();
// })

// if user click search icon process the search
$("#searchBtn").click(function(event) {
    // console.log(event);

    event.preventDefault;
    var cityName = $('input').val();
    console.log(cityName);

    // pass cityName to query result
    getWeather(cityName);
})

// if user press enter search icon process the search
// use .keypress method
// check for evenkeyCode 13 which is enter
$('input').keypress(function(event) {
    // console.log("keypress event = " + event);

    if (event.keyCode === 13) {
        event.preventDefault;
        var cityName = $('input').val();
        console.log(cityName);

        // pass cityName to query result
        getWeather(cityName);
    }
});



