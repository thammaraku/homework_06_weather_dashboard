let cityName = "";
let cityLong = 0;
let cityLa = 0;
let temperature = 0;
let humidity = 0;
let windSpeed = 0;
let uvIndex = 0;

let apiKey = "&appid=72b683573979f675e34ed4c06ed32896"
let weatherPrefix = "http://api.openweathermap.org/data/2.5/weather?units=imperial&q="
let fiveDaysPrefix = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q="
let uvPrefix = "http://api.openweathermap.org/data/2.5/uvi?"

let searchHistory = {};
const apikey = "&appid=72b683573979f675e34ed4c06ed32896";


$(document).ready(() => {
    // localStorage.clear();
    renderSearchHistory();
})

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

$('#searchBtn').click(function(event) {
    event.preventDefault;
    var cityName = $('input').val();
    console.log(cityName);

})