let cityButton = document.getElementById("city-button");

function populateCity() {
    addNewCity();
}

function addNewCity(){
    console.log("Here");
    let cityList = document.getElementById("city-list");
    let newCityEl = document.createElement("li");
    newCityEl.className = "list-group-item list-group-item-primary m-1";
    console.log(document.getElementById("cityName").value.trim());
    newCityEl.textContent = document.getElementById("cityName").value.trim();
    newCityEl.setAttribute("data-attribute",document.getElementById("cityName").value.trim());
    newCityEl.addEventListener("click", function (event) {
        event.preventDefault();
        let targetCity = event.target.getAttribute("data-attribute");
        // call function to populate target city weather
    });
    cityList.appendChild(newCityEl);
    document.getElementById("cityName").value="";
}

cityButton.addEventListener("click",populateCity);