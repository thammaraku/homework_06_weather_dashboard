//////////////////////////// VARIABLES ////////////////////////////////////////


var cityName = "";
var country = "";
var cityLong = 0;
var cityLa = 0;
var temperature = 0;
var humidity = 0;
var windSpeed = 0;
var uvIndex = 0;
var weatherPrefix = "http://api.openweathermap.org/data/2.5/weather?units=imperial&q="
var fiveDaysPrefix = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q="
var uvPrefix = "http://api.openweathermap.org/data/2.5/uvi?"
var oneCallPrefix = "http://api.openweathermap.org/data/2.5/onecall?"
var iconURL = 'https://openweathermap.org/img/wn/';
var searchHistory = {};
const apiKey = "&appid=72b683573979f675e34ed4c06ed32896";

var iconName = '';


//////////////////////////// FUNCTION ////////////////////////////////////////

function initLocalStorage() {
    localStorage.setItem('searchHistory', '[]');
}

// render search record city and country
function renderSearch() {
    var searchHistoryObj = JSON.parse(localStorage.getItem('searchHistory'));
    if (searchHistoryObj) {
        for (var i = 0; i < searchHistoryObj.length; ++i) {
            $(`#row${i}`).html(`<td><button class="recent btn btn-link">${searchHistoryObj[i].cityName}, ${searchHistoryObj[i].country}</button></td>`);
        }
    }

}

function saveLocalStorage(searchHistoryObj) {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryObj));
}

// add search city input into search record array
function addSearch(cityName, country) {
    var obj = {
        "cityName": cityName,
        "country": country
    }

    var searchHistoryObj = JSON.parse(localStorage.getItem('searchHistory'));
    if (!searchHistoryObj) {
        searchHistoryObj = [];
    }

    // to check if it is the same as existing city in array or not
    var sameCity = false;

    for (var i = 0; i < searchHistoryObj.length; ++i) {

        if (searchHistoryObj[i].cityName === obj.cityName) {
            searchHistoryObj[i].country === obj.country;
            sameCity = true;
        }
    }

    if (sameCity === false) {
        searchHistoryObj.push(obj);
    }

    // if length is greater than 8 remove the first search by using shift method
    if (searchHistoryObj.length > 8) {
        searchHistoryObj.shift();
    }

    saveLocalStorage(searchHistoryObj);
}



// use ajax to get weather uvi and forecase information 
function getWeather(cityName) {
    // using cityName to temp humidity windspeed and latitude and longtitude
    var urlWeatherTest = weatherPrefix + cityName + apiKey;
    $.ajax({
        url: weatherPrefix + cityName + apiKey,
        method: "GET",
        error: function (err) {
            alert("The city was not found. Please check your spelling")
            return;
        }
    })
        .then(function (response) {
            cityName = response.name;
            country = response.sys.country;
            cityLong = response.coord.lon;
            cityLa = response.coord.lat;
            temperature = response.main.temp;
            humidity = response.main.humidity;
            windSpeed = response.wind.speed;
            iconName = response.weather[0].icon;

            // since ajax is asynchronous need to move both Uvi and Fivedays request to be after weather to pass the latitute and longtitude value
            // using latitude and lontitude to get uvIndex data
            var urlUviTest = uvPrefix + apiKey + "&lat=" + cityLa + "&lon=" + cityLong;

            $.ajax({
                url: uvPrefix + apiKey + "&lat=" + cityLa + "&lon=" + cityLong,
                method: "GET",
            })
                .then(function (response) {
                    uvIndex = response.value;
                })
            // user cityName to get fiveDays forecast
            var urlFiveDaysTest = fiveDaysPrefix + cityName + apiKey;
            $.ajax({
                url: fiveDaysPrefix + cityName + apiKey,
                method: "GET"
            })
                .then(function (response) {
                    return getFiveDaysData(response);
                })
        })
        .then(function () {
            currentWeather(cityName);
        })
}

// to convert unix time from response
function convertUnixTime(unixTime) {
    return moment(unixTime).format('MM/DD/YYYY, h:mm:ss a');
}

// to display weather information in the main section
function currentWeather(cityName) {
    $('#cityName').text(cityName + ', ' + country + ' ' + '(' + convertUnixTime(Date.now()) + ')');

    addSearch(cityName, country);
    renderSearch();

    $('#weatherIcon').attr('src', iconURL + iconName + '.png');
    $('#temperature').text('Temperature: ' + temperature + ' ' + String.fromCharCode(176) + 'F');
    $('#humidity').text('Humidity: ' + humidity + '%');
    $('#windSpeed').text('Wind Speed: ' + windSpeed + ' MPH');
    $('#uvIndex').text('UV Index: ' + uvIndex);
}

// to display forecast
function getFiveDaysData(response) {
    var fiveDaysArray = response.list;
    var dayNumber = 1;
    for (var i = 0; i < fiveDaysArray.length; i += 8) {
        $(`#day${dayNumber}`).find('h5').text(convertUnixTime(fiveDaysArray[i].dt * 1000));
        $(`#day${dayNumber}`).find('.weatherIcon').attr('src', iconURL + fiveDaysArray[i].weather[0].icon + '.png');
        $(`#day${dayNumber}`).find('.tempText').text('Temperature:' + fiveDaysArray[i].main.temp);
        $(`#day${dayNumber}`).find('.humidityText').text('Humidity: ' + fiveDaysArray[i].main.humidity + '%');

        ++dayNumber;
    }
}


//////////////////////////// EXECUTION ////////////////////////////////////////

// Render search history when load the page
$(document).ready(() => {
    renderSearch();
})

// if user click search icon process the search
$("#searchBtn").click(function (event) {
    event.preventDefault;
    var cityName = $('input').val();
    // pass cityName to query result
    renderSearch();

    getWeather(cityName);
})

// if user press enter search icon process the search
// use .keypress method
// check for evenkeyCode 13 which is enter
$("input").keypress(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault;
        var cityName = $('input').val();
        // pass cityName to query result
        getWeather(cityName);
    }
});

// if user click on the search histor
$("table").on("click", ".recent", function (event) {
    event.preventDefault();
    getWeather($(this).text());
});

