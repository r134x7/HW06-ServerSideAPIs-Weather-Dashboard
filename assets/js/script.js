var apiKey = "88237246776863c0ea0178b57d538861"; // saving api key under a variable

var cityInputEl = document.querySelector('#city-input'); // selector for city input
var searchFormEl = document.querySelector('#search-form'); // selector for form
var searchAndHistory = document.querySelector(".search-and-history"); // selector for div container for seach input and history
var currentWeather = document.querySelector(".currentWeather"); // selector for div container for the current weather
var fiveDayForecast = document.querySelector(".fiveDayForecast"); // selector for div container for the five day forecast

var capture = []; // empty array to store city names
var take = JSON.parse(localStorage.getItem("history")); // a status check to avoid bugs in line 237: getHistory()

function handleSearchFormSubmit(event) {
    event.preventDefault(); // to prevent the page from refreshing
  
    var cityInputVal = cityInputEl.value; // saves the city input value into a variable
    // console.log(cityInputVal)
  
    if (!cityInputVal) { // checks if value is undefined
     var error = document.createElement("h3")
      error.setAttribute("class", "fs-2 badge text-danger bg-dark");
      error.textContent = 'Enter a city name into the input field';
      currentWeather.appendChild(error);
      return;
    }

    if (!capture.includes(cityInputEl)) { // checks string to avoid duplication, source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
        generateHistory();
      }

    while (currentWeather.firstChild) { // to clear results when entering a new search source: https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
        currentWeather.removeChild(currentWeather.firstChild);
    }

    while (fiveDayForecast.firstChild) {
        fiveDayForecast.removeChild(fiveDayForecast.firstChild);
    }

    var getCoordinates = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInputVal + "&limit=1" + "&appid=" + apiKey; // to get the co-ordinates for making one call API

    cityInputEl.textContent = ""; // clears text input

    fetch(getCoordinates) // this is the first API call that gets the co-ordinates
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            // console.log(data);
            // console.log("first api call above");
            var lat = data[0]["lat"]; // retrieves latitude
            var lon = data[0]["lon"]; // retrieves longitude
            var name = data[0]["name"]; // retrieves name
            // console.log(name);
        

            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts" + "&appid=" + apiKey + "&units=metric"; // to make one call API using co-ordinates retrieved earlier

            fetch(queryURL) // this is the second API call that uses the co-ordinates retreived to use the One Call API because it requires co-ordinates, it doesn't let you search via city name.
                .then(function (response) {
                    return response.json();
            })
            .then(function (data) {
                // console.log(data);
                // console.log("second api call above");
                // console.log(name);
                var currentDay1 = [name, data.current.dt, data.current.weather[0]["icon"], data.current.temp, data.current.humidity, data.current.wind_speed, data.current.uvi];
                    //  console.log(currentDay1);
                var border = document.createElement("div") // for creating a box for the current weather
                border.setAttribute("class", "border border-dark bg-info")
                currentWeather.appendChild(border)
                var unorderedList = document.createElement("ul") // to get some elements inline using bootstrap
                unorderedList.setAttribute("class", "list-inline")
                border.appendChild(unorderedList)
                for (var i = 0; i < currentDay1.length; i++) { // for loop for generating data to put onto the page using data from variable currentDay1
                    var listItem = document.createElement("li");

                           if (currentDay1[i] === currentDay1[2]) { // the weather icon
                               listItem.setAttribute("class", "list-inline-item fw-bold lead p-2")
                               var listItem = document.createElement("img")
                               listItem.setAttribute("src", "https://openweathermap.org/img/wn/" + currentDay1[i] + "@2x.png")
                            //    listItem.setAttribute("class", "list-inline-item")
                            //    console.log(currentDay1[i])
                               // currentWeather.appendChild(listItem);

                           } else if (currentDay1[i] === currentDay1[1]) { // the date
                            listItem.setAttribute("class", "list-inline-item fw-bold lead p-2")
                            listItem.textContent = moment.unix(currentDay1[i]).format("(D/MMM/YYYY)") // parsing unix timestamp using moment.js
                            // console.log(currentDay1[i])
                               
                           } else if (currentDay1[i] === currentDay1[3]) { // the temperature
                            listItem.setAttribute("class", "lead p-2")
                            listItem.setAttribute("style", "list-style: none")
                            listItem.textContent = "Temp: " + currentDay1[i] + "°C";
                            // console.log(currentDay1[i])

                           } else if (currentDay1[i] === currentDay1[4]) { // the humidity
                            listItem.setAttribute("class", "lead p-2")
                            listItem.setAttribute("style", "list-style: none")
                            listItem.textContent = "Humidity: " + currentDay1[i] + "%";
                            // console.log(currentDay1[i])

                           } else if (currentDay1[i] === currentDay1[5]) { // the wind speed
                            listItem.setAttribute("class", "lead p-2")
                            listItem.setAttribute("style", "list-style: none")
                            listItem.textContent = "Wind: " + currentDay1[i] + "m/s";
                            // console.log(currentDay1[i])

                           } else if (currentDay1[i] === currentDay1[6]) { // the UV index
                            listItem.setAttribute("class", "lead p-2")
                            listItem.setAttribute("style", "list-style: none")
                            var span = document.createElement("span");
                            // uv index colour source: https://en.wikipedia.org/wiki/Ultraviolet_index
                            listItem.textContent = "UV index: "
                            listItem.append(span);
                            span.textContent = " " + currentDay1[i] + " ";

                            var uvRange = Number(currentDay1[6]); // the setAttributes below look repetitive but if I do two seperate styles for one thing then the new style overwrites the old one
                                if (uvRange < 3) { // low
                                    span.setAttribute("style", "background-color: green; font-weight: bold; padding: 7px 17px 7px 17px; border-radius: 8px; color: white;")
                                } else if (uvRange >= 3 && uvRange < 6) { // moderate
                                    span.setAttribute("style", "background-color: yellow; font-weight: bold; padding: 7px 17px 7px 17px; border-radius: 8px; color: white;")
                                } else if (uvRange >= 6 && uvRange < 8) { // high
                                    span.setAttribute("style", "background-color: orange; font-weight: bold; padding: 7px 17px 7px 17px; border-radius: 8px; color: white;")
                                } else if (uvRange >= 8 && uvRange < 11) { // very high
                                    span.setAttribute("style", "background-color: red; font-weight: bold; padding: 7px 17px 7px 17px; border-radius: 8px; color: white;")
                                } else if (uvRange >= 11) { // extreme
                                    span.setAttribute("style", "background-color: violet; font-weight: bold; padding: 7px 17px 7px 17px; border-radius: 8px; color: white;")
                                }
                                // console.log(currentDay1[i])
                           } else { // the city name
                               listItem.setAttribute("class", "list-inline-item fw-bold lead p-2")
                               listItem.textContent = currentDay1[i];
                            //    console.log(currentDay1[i])
                            }
                        if (currentDay1[i] === currentDay1[1] || currentDay1[i] === currentDay1[2] || currentDay1[i] === currentDay1[0]) {
                            unorderedList.appendChild(listItem); // appends to unordered list for inline elements
                        } else {
                            border.appendChild(listItem); // appends to div to avoid being inline elements
                        }
                    } // for loop ends here
                
                var header2 = document.createElement("h2") // five day forecast title
                header2.setAttribute("class", "fs-2 fw-bold p-2")
                header2.textContent = "5-Day Forecast: "
                fiveDayForecast.appendChild(header2);
                    
                for (var j = 1; j < 6; j++) { // to loop through each day
                    var forecastDay1 = [data.daily[j]["dt"], data.daily[j]["weather"][0]["icon"], data.daily[j]["temp"]["day"], data.daily[j]["humidity"], data.daily[j]["wind_speed"]]; // only need date, weather icon, temperature, humidity, wind speed.
                    // console.log(forecastDay1);
                    var border = document.createElement("div") // borders for each day
                    border.setAttribute("class", "border border-light bg-dark")
                    fiveDayForecast.appendChild(border)
                    // for loop for generating data to put onto the page using data from variable forecastDay1
                    for (var i = 0; i < forecastDay1.length; i++) { // nested for loop
                        var listItem = document.createElement("li");
                        listItem.setAttribute("style", "list-style: none")

                        if (forecastDay1[i] === forecastDay1[1]) { // the weather icon
                            var listItem = document.createElement("img")

                            listItem.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastDay1[i] + "@2x.png")
                            // console.log(forecastDay1[i])

                        } else if (forecastDay1[i] === forecastDay1[0]) { // the date
                         listItem.setAttribute("class", "fs-4 p-2 fw-bold text-light")
                         
                         listItem.textContent = moment.unix(forecastDay1[i]).format("D/MMM/YYYY") // parsing unix timestamp using moment.js
                        //  console.log(forecastDay1[i])

                        } else if (forecastDay1[i] === forecastDay1[2]) { // the temperature
                         listItem.setAttribute("class", "fs-4 p-2 text-light")

                         listItem.textContent = "Temp: " + forecastDay1[i] + "°C";
                        //  console.log(forecastDay1[i])

                        } else if (forecastDay1[i] === forecastDay1[3]) { // the humidity
                         listItem.setAttribute("class", "fs-4 p-2 text-light")
                         
                         listItem.textContent = "Humidity: " + forecastDay1[i] + "%";
                        //  console.log(forecastDay1[i])

                        } else if (forecastDay1[i] === forecastDay1[4]) { // the wind speed
                         listItem.setAttribute("class", "fs-4 p-2 text-light")
                         
                         listItem.textContent = "Wind: " + forecastDay1[i] + "m/s";
                        //  console.log(forecastDay1[i])
                        } 

                       border.appendChild(listItem); // appends to div made, for loop ends here
                    }
                }
            });
        });
    }

  function generateHistory() { // when a city is searched, it generates a button and puts search history into local storage
    var historyButton = document.createElement("button");
    historyButton.setAttribute("class", "btn btn-secondary btn-lg px-5 mb-2");
    historyButton.textContent = cityInputEl.value;
  
    if (!capture.includes(cityInputEl.value)) { // checks to avoid making duplicate buttons of same city
      capture.push(cityInputEl.value);
      localStorage.setItem("history", JSON.stringify(capture)); // puts
      historyButton.addEventListener("click", function (event) {
        cityInputEl.value = event.target.innerHTML; // ensures the correct city name is retrieved when a button is clicked
        handleSearchFormSubmit(event);
      });
    } else {
      return;
    }
  
    searchAndHistory.appendChild(historyButton); // appends button to the page of the searchAndHistory div
  }

  function getHistory() { // to retrieve search history from local storage
    capture = JSON.parse(localStorage.getItem("history")); // retrieves storage and puts it into global variable
    for (var i = 0; i < capture.length; i++) { // for loop for generating past history buttons
      var historyButton = document.createElement("button");
      historyButton.setAttribute("class", "btn btn-secondary btn-lg px-5 mb-2")
      historyButton.setAttribute("data-search", i);
      historyButton.textContent = capture[i];
  
      historyButton.addEventListener("click", function (event) {
        cityInputEl.value = event.target.innerHTML; // ensures the correct city name is retrieved when a button is clicked
        handleSearchFormSubmit(event);
      });
      searchAndHistory.appendChild(historyButton); // appends button to the page of the searchAndHistory div
    }
  }

  searchFormEl.addEventListener("submit", handleSearchFormSubmit);

  if (take !== null) { // to avoid bugs if no local storage used
      getHistory();
  }