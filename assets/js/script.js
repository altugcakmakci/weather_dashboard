let cityButton = document.getElementById("city-button");

function populateCity() {
    let cityName = document.getElementById("cityName").value.trim();
    getCityLocation(cityName);

}

function addNewCity(cityName){
    console.log("Here");
    
    let cityList = document.getElementById("city-list");
    let newCityEl = document.createElement("li");
    newCityEl.className = "list-group-item list-group-item-primary m-1";
    
    console.log(cityName);
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

cityButton.addEventListener("click",populateCity);

let getCityLocation = function (cityName) {
    
    let apiUrl = 'http://api.weatherapi.com/v1/forecast.json?key=06e270c630a944389ef150954212709&q='+cityName+'&aqi=no';
    console.log(apiUrl);
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
            console.log(data.location);
            let region = data.location.region;
            let cityTitleEl = document.getElementById("city-title");
            cityTitleEl.textContent = cityName + ", " + region + " ("+moment().format("MMMM do,YYYY")+")";
            addNewCity(cityName);
        });
      } else {
        alert("Please enter a valid city name!");
        document.getElementById("cityName").value="";
      }
    });
  };