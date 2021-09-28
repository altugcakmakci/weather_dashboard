let cityButton = document.getElementById("city-button");
let storedCities = [];

function populateCity() {
    let cityName = document.getElementById("cityName").value.trim();
    getCityLocation(cityName);

}

function addCityListElement(cityName){
    let cityList = document.getElementById("city-list");
    let newCityEl = document.createElement("li");
    newCityEl.className = "list-group-item list-group-item-primary m-1";
    

    newCityEl.textContent = cityName;
    newCityEl.setAttribute("data-attribute",cityName);
    newCityEl.addEventListener("click", function (event) {
        event.preventDefault();
        let targetCity = event.target.getAttribute("data-attribute");
        // call function to populate target city weather
    });
    cityList.appendChild(newCityEl);
    document.getElementById("cityName").value="";

}

function addNewCity(cityName){
    console.log("Here");

    console.log(cityName);
    if (storedCities==null){
        storedCities=[cityName];
    } else {
        storedCities.push(cityName);
    }
    localStorage.setItem("City-List", JSON.stringify(storedCities));

    addCityListElement(cityName);
    
}

cityButton.addEventListener("click",populateCity);

let getCityLocation = function (cityName) {
    
    let apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q='+cityName+'&units=metric&APPID=26d75bfcf641ce6a0281c23a223200c6';
    console.log(apiUrl);
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data);

            let cityTitleEl = document.getElementById("city-title");
            cityTitleEl.textContent = cityName + ", " + data.sys.country + " ("+moment().format("MMMM do,YYYY")+")";
            let tempEl = document.getElementById("temp");
            tempEl.textContent = "Temp: " + data.main.temp + " °C";
            let windEl = document.getElementById("wind");
            windEl.textContent = "Wind: " + data.wind.speed + " km/h";
            let humidityEl = document.getElementById("humidity");
            humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
            
            let uviUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+data.coord.lat+'&lon='+data.coord.lon+'&units=metric&APPID=26d75bfcf641ce6a0281c23a223200c6';
            console.log(uviUrl);
            fetch(uviUrl).then(function (resp){
                if (response.ok) {
                    resp.json().then(function (uvdata) {
                        console.log(uvdata);
                        let uvIndexEl = document.getElementById("uv-index");
                        let uvLevel = uvdata.current.uvi;
                        let uvValueEl = document.createElement('span');
                        uvIndexEl.textContent = "UV Index: ";
                        uvValueEl.textContent = uvLevel;
                        if (uvLevel<2){
                            uvValueEl.classList = "rounded p-1 uv_low";
                        } else if (uvLevel>=2 && uvLevel<5){
                            uvValueEl.classList = "rounded p-1 uv_mod";
                        } else if (uvLevel>=5 && uvLevel<7){
                            uvValueEl.classList = "rounded p-1 uv_high";
                        } else {
                            uvValueEl.classList = "rounded p-1 uv_very_high";
                        }   
                        uvIndexEl.appendChild(uvValueEl);
                        addNewCity(cityName);
                    });
                } else {
                    alert("Cannot read UV data!");
                    document.getElementById("cityName").value="";
                }
                
            });
        });
      } else {
        alert("Please enter a valid city name!");
        document.getElementById("cityName").value="";
      }
    });
  };

  function populateCityList(){
    storedCities = JSON.parse(localStorage.getItem("City-List"));
    console.log(storedCities);
    for(let i=0;i<storedCities.length;i++){
        addCityListElement(storedCities[i]);
    }
  }

  populateCityList();