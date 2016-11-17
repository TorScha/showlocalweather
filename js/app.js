/**
 * Created by TorScha on 17.11.2016.
 */
var x = document.getElementById("location");
var city = "";
var country = "";
var icon = "http://openweathermap.org/img/w/";
var imageIcon = "";

$(function () {
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather);
        //navigator.geolocation.getCurrentPosition(getCity);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

function showWeather(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var button = document.getElementById("switch");
    var output = document.getElementById("temp");
    var einheit = document.getElementById("einheit");
    var temp = 0;
    var fahrenheit = false;

    //alert(button);
    $("#switch").on("click", function () {
        if (button.innerText === "C") {
            button.innerText = "F";
            temp = Math.round(temp * 1.8 + 32);
            output.innerText = temp;
            fahrenheit = true;
        } else {
            button.innerText = "C";
            if (fahrenheit === true) {
                temp = Math.round((temp - 32) / 1.8);
                output.innerText = temp;
            }
        }
    });

    $.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=a9081ba13c26cc65d23412438da3886d&units=metric", function (data) {
        temp = data.main.temp;
        output.innerText = Math.round(temp);
        icon += data.weather[0].icon + ".png";
        imageIcon = data.weather[0].icon;
        getBackgroundPicture(data.weather[0].main);
        getCity(position);
        $("#content").show("slow");
    });
}

function getCity(position) {
    // data[4], um Stadt und Land (Kurzform) zu bekommen.

    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var loc = document.getElementById("location");
    var img = document.getElementById("image");
    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyCOiOW3YdJlWcKV8e7fbyc11KhIsD-oaqs", function (data) {

        //city = data.results[0].address_components[3].long_name;
        //console.log(city);
        var i, j;
        first:
            for (i = 0; i < data.results.length; i++) {
                for (j = 0; j < data.results[i].address_components.length; j++) {
                    if (data.results[i].address_components[j].types[0] === "locality" && data.results[i].address_components[j].types[1] === "political") {
                        city = data.results[i].address_components[j].long_name;
                        country = data.results[i].address_components[j + 2].short_name;
                        break first;
                    }
                }
            }

        console.log(city + ", " + country);

        loc.innerText = city + ", " + country;

        img.innerHTML = "<img src='" + icon + "' alt='" + imageIcon + "'/>";

    });
}

function getBackgroundPicture(weather) {
    var backgroundPicture = document.body;
    weather = weather.toLowerCase();
    backgroundPicture.className = "";
    //console.log(weather);
    switch (weather) {
        case "thunderstorm":
            backgroundPicture.className = "thunderstorm";
            break;
        case "drizzle":
            backgroundPicture.className = "drizzle";
            break;
        case "rain":
            backgroundPicture.className = "rain";
            break;
        case "snow":
            backgroundPicture.className = "snow";
            break;
        case "atmosphere":
            backgroundPicture.className = "atmosphere";
            break;
        case "clear":
            backgroundPicture.className = "clear";
            break;
        case "clouds":
            backgroundPicture.className = "clouds";
            break;
        case "extreme":
            backgroundPicture.className = "extreme";
            break;
    }
}

