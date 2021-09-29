let cityButton = document.getElementById("city-button");
let resetButton = document.getElementById("reset-button");
let celButton = document.getElementById("celcius");
let fahButton = document.getElementById("fahrenheit");

let storedCities = [];
let unitType = "metric";
let unitName = "C";
let speedUnit = "km/h";

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function populateCity() {
    let cityName = capitalize(document.getElementById("cityName").value.trim());
    if (cityName != null && cityName.length > 0) {
        getCityWeather(cityName);
    }
}

function generateCurrentTab() {
    let currentTabEl = document.getElementById("current-tab");
    currentTabEl.innerHTML = "";
    let newdivEl = document.createElement("div");
    newdivEl.className = "bg-primary p-3 m-2 ";

    let newHeaderEl = document.createElement("h3");
    newHeaderEl.setAttribute('id', 'city-title');
    newHeaderEl.classList.add("text-light");
    newHeaderEl.classList.add("font-weight-bold");
    newdivEl.appendChild(newHeaderEl);

    let newp1El = document.createElement("p");
    newp1El.setAttribute('id', 'temp');
    newp1El.classList.add("text-white");
    newp1El.classList.add("body_text");
    newdivEl.appendChild(newp1El);

    let newp2El = document.createElement("p");
    newp2El.setAttribute('id', 'wind');
    newp2El.classList.add("text-white");
    newp2El.classList.add("body_text");
    newdivEl.appendChild(newp2El);

    let newp3El = document.createElement("p");
    newp3El.setAttribute('id', 'humidity');
    newp3El.classList.add("text-white");
    newp3El.classList.add("body_text");
    newdivEl.appendChild(newp3El);

    let newp4El = document.createElement("p");
    newp4El.setAttribute('id', 'uv-index');
    newp4El.classList.add("text-white");
    newp4El.classList.add("body_text");
    newdivEl.appendChild(newp4El);

    currentTabEl.appendChild(newdivEl);
}

function addCityListElement(cityName) {
    let cityList = document.getElementById("city-list");
    let newCityEl = document.createElement("li");
    newCityEl.className = "list-group-item list-group-item-primary m-1 city-list-item";


    newCityEl.textContent = cityName;
    newCityEl.setAttribute("data-attribute", cityName);
    newCityEl.addEventListener("click", function (event) {
        event.preventDefault();
        let targetCity = event.target.getAttribute("data-attribute");
        getCityWeather(targetCity);
    });

    cityList.appendChild(newCityEl);
    document.getElementById("cityName").value = "";

}

function addNewCity(cityName) {
    if (storedCities == null) {
        storedCities = [cityName];
    } else {
        if (storedCities.includes(cityName)) {
            return;
        } else {
            storedCities.push(cityName);
        }
    }
    localStorage.setItem("City-List", JSON.stringify(storedCities));

    addCityListElement(cityName);

}

function getCityWeather(cityName) {

    let apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=' + unitType + '&APPID=26d75bfcf641ce6a0281c23a223200c6';
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                generateCurrentTab();
                let cityTitleEl = document.getElementById("city-title");
                cityTitleEl.textContent = cityName + ", " + data.sys.country + " (" + moment().format("MMM Do, YYYY") + ")";
                let curImgEl = document.createElement("img");
                curImgEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
                cityTitleEl.appendChild(curImgEl);

                let tempEl = document.getElementById("temp");
                tempEl.textContent = "Temp: " + data.main.temp + " °" + unitName;
                let windEl = document.getElementById("wind");
                windEl.textContent = "Wind: " + data.wind.speed + " " + speedUnit;
                let humidityEl = document.getElementById("humidity");
                humidityEl.textContent = "Humidity: " + data.main.humidity + "%";

                let uviUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&units=' + unitType + '&APPID=26d75bfcf641ce6a0281c23a223200c6';
                fetch(uviUrl).then(function (resp) {
                    if (response.ok) {
                        resp.json().then(function (uvdata) {
                            let uvIndexEl = document.getElementById("uv-index");
                            let uvLevel = uvdata.current.uvi;
                            let uvValueEl = document.createElement('span');
                            uvIndexEl.textContent = "UV Index: ";
                            uvValueEl.textContent = uvLevel;
                            if (uvLevel < 2) {
                                uvValueEl.classList = "rounded p-1 uv_low";
                            } else if (uvLevel >= 2 && uvLevel < 5) {
                                uvValueEl.classList = "rounded p-1 uv_mod";
                            } else if (uvLevel >= 5 && uvLevel < 7) {
                                uvValueEl.classList = "rounded p-1 uv_high";
                            } else {
                                uvValueEl.classList = "rounded p-1 uv_very_high";
                            }
                            uvIndexEl.appendChild(uvValueEl);
                            addNewCity(cityName);
                            getDailyWeather(uvdata.lat, uvdata.lon);
                        });
                    } else {
                        alert("Cannot read UV data!");
                        document.getElementById("cityName").value = "";
                    }

                });
            });
        } else {
            alert("Please enter a valid city name!");
            document.getElementById("cityName").value = "";
        }
    });
};

function populateCityList() {
    storedCities = JSON.parse(localStorage.getItem("City-List"));
    if (storedCities === null) {
        return;
    }
    for (let i = 0; i < storedCities.length; i++) {
        addCityListElement(storedCities[i]);
    }
}

function getDailyWeather(cityLat, cityLon) {
    let apiUrl = 'http://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&units=' + unitType + '&APPID=26d75bfcf641ce6a0281c23a223200c6';
    let cardsTabEl = document.getElementById("cards-row");
    cardsTabEl.innerHTML = '';
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                for (let i = 0; i < 5 && i < data.daily.length; i++) {
                    let newCardEl = document.createElement('div');
                    newCardEl.className = "col-12 col-md-2 col-l-2 p-2 m-2 bg-primary text-white w-20 daily_card";
                    let dateEl = document.createElement("p");
                    dateEl.textContent = moment().add(i+1, 'days').format("MMM Do");
                    dateEl.className = "text-nowrap";
                    newCardEl.appendChild(dateEl);
                    let curImgEl = document.createElement("img");
                    curImgEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
                    newCardEl.appendChild(curImgEl);
                    let tempEl = document.createElement("p");
                    tempEl.textContent = "Temp: " + data.daily[i].temp.max + " °" + unitName;
                    tempEl.className = "text-nowrap";
                    newCardEl.appendChild(tempEl);
                    let windEl = document.createElement("p");
                    windEl.textContent = "Wind: " + data.daily[i].wind_speed + " " + speedUnit;
                    windEl.className = "text-nowrap";
                    newCardEl.appendChild(windEl);
                    let humidityEl = document.createElement("p");
                    humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
                    humidityEl.className = "text-nowrap";
                    newCardEl.appendChild(humidityEl);

                    cardsTabEl.appendChild(newCardEl);
                }
            });
        }
    });
}

function resetCityList() {
    localStorage.removeItem("City-List");
    document.getElementById("city-list").innerHTML = "";
    populateCityList();
}

cityButton.addEventListener("click", populateCity);
resetButton.addEventListener("click", resetCityList);

celButton.addEventListener("click", function (event) {
    event.preventDefault();
    unitType = "metric";
    unitName = "C";
    speedUnit = "km/h";
    celButton.classList = "btn btn-primary button-checked";
    fahButton.classList = "btn btn-primary button-unchecked";
});

fahButton.addEventListener("click", function (event) {
    event.preventDefault();
    unitType = "imperial";
    unitName = "F";
    speedUnit = "MPH";
    celButton.classList = "btn btn-primary button-unchecked";
    fahButton.classList = "btn btn-primary button-checked";
});

populateCityList();