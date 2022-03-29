var apiKey = "88237246776863c0ea0178b57d538861"; // saving api key under a variable

var cityInputEl = document.querySelector('#city-input'); // selector for city input
var searchFormEl = document.querySelector('#search-form'); // selector for form
var searchAndHistory = document.querySelector(".search-and-history"); // selector for div container for seach input and history
var container = document.querySelector(".container"); // selector for div container for the current weather
var fiveDayForecast = document.querySelector(".fiveDayForecast"); // selector for div container for the five day forecast

var capture = []; // empty array
var take = JSON.parse(localStorage.getItem("history")); // to check

function handleSearchFormSubmit(event) {
    event.preventDefault(); // to prevent the page from refreshing
  
    var cityInputVal = cityInputEl.value; // saves the city input value into a variable
    // console.log(cityInputVal)
  
    if (!cityInputVal) { // checks if value is undefined
      console.error('Enter a city in the input field');
      return;
    }

    if (take === null) {
        generateHistory();
    } else if (!take.includes(cityInputVal)) {
        generateHistory();
    }

    while (container.firstChild) { // to clear results when entering a new search source: https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
        container.removeChild(container.firstChild);
    }

    while (fiveDayForecast.firstChild) {
        fiveDayForecast.removeChild(fiveDayForecast.firstChild);
    }

    var getCoordinates = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInputVal + "&limit=1" + "&appid=" + apiKey; // to get the co-ordinates for making one call API
  
    // var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInputVal + "&appid=" + apiKey + "&units=metric"; // makes an API call using the citInput and the API Key
    // var queryURL = "https://api.openweathermap.org/data/2.5/onecall?q=" + cityInputVal + "&appid=" + apiKey; // this will be needed for making a second call after getting the coodinates
    
    // console.log(queryURL)

    cityInputEl.textContent = ""; // clears text input
  
    // location.assign(queryURL);

    fetch(getCoordinates)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log("first api call above");
            var lat = data[0]["lat"]; // retrieves latitude
            var lon = data[0]["lon"]; // retrieves longitude
            var name = data[0]["name"]; // retrieves name
            console.log(name);
        

            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts" + "&appid=" + apiKey + "&units=metric"; // to make one call API using co-ordinates retrieved earlier

            fetch(queryURL) // making a second api call
                .then(function (response) {
                    return response.json();
            })
            .then(function (data) {
                console.log(data);
                console.log("second api call above");
                console.log(name);
                var currentDay1 = [name, data.current.dt, data.current.weather[0]["icon"], data.current.temp, data.current.humidity, data.current.wind_speed, data.current.uvi];
                     console.log(currentDay1);
                     for (var i = 0; i < currentDay1.length; i++) { 
                           if (currentDay1[i] === currentDay1[2]) {
                               var listItem = document.createElement("img")
                               listItem.setAttribute("src", "http://openweathermap.org/img/wn/" + currentDay1[i] + "@2x.png")
                               console.log(currentDay1[i])
                               // container.appendChild(listItem);
                           } else if (currentDay1[i] === currentDay1[1]) {
                            var listItem = document.createElement("li");
                            
                            listItem.textContent = moment.unix(currentDay1[i]).format("(D/MMM/YYYY)") // parsing unix timestamp using moment.js
                            console.log(currentDay1[i])
                               
                           } else if (currentDay1[i] === currentDay1[3]) {
                            var listItem = document.createElement("li");

                            listItem.textContent = "Temp: " + currentDay1[i] + "°C";
                            console.log(currentDay1[i])
                           } else if (currentDay1[i] === currentDay1[4]) {
                            var listItem = document.createElement("li");

                            listItem.textContent = "Humidity: " + currentDay1[i] + "%";
                            console.log(currentDay1[i])
                           } else if (currentDay1[i] === currentDay1[5]) {
                            var listItem = document.createElement("li");

                            listItem.textContent = "Wind: " + currentDay1[i] + "m/s";
                            console.log(currentDay1[i])
                           } else if (currentDay1[i] === currentDay1[6]) {
                            var listItem = document.createElement("li");
                            var span = document.createElement("span");
                            // uv index colour source: https://en.wikipedia.org/wiki/Ultraviolet_index
                            listItem.textContent = "UV index: "
                            listItem.append(span);
                            span.textContent = " " + currentDay1[i] + " ";
                            var uvRange = Number(currentDay1[6]);
                            if (uvRange < 3) {
                                span.setAttribute("style", "background-color: green; font-weight: bold; padding: 10px 20px 10px 20px; border-radius: 8px; color: white;")
                            } else if (uvRange >= 3 && uvRange < 6) {
                                span.setAttribute("style", "background-color: yellow; font-weight: bold; padding: 10px 20px 10px 20px; border-radius: 8px; color: white;")
                            } else if (uvRange >= 6 && uvRange < 8) {
                                span.setAttribute("style", "background-color: orange; font-weight: bold; padding: 10px 20px 10px 20px; border-radius: 8px; color: white;")
                            } else if (uvRange >= 8 && uvRange < 11) {
                                span.setAttribute("style", "background-color: red; font-weight: bold; padding: 10px 20px 10px 20px; border-radius: 8px; color: white;")
                            } else if (uvRange >= 11) {
                                span.setAttribute("style", "background-color: violet; font-weight: bold; padding: 10px 20px 10px 20px; border-radius: 8px; color: white;")
                            }
                            console.log(currentDay1[i])
                           } else {
                               var listItem = document.createElement("li");

                               listItem.textContent = currentDay1[i];
                               console.log(currentDay1[i])
                            }

                          container.appendChild(listItem); // appends to current weather forecast
                        } // for loop ends here
                for (var j = 1; j < 6; j++) { // to loop through each day
                    var forecastDay1 = [data.daily[j]["dt"], data.daily[j]["weather"][0]["icon"], data.daily[j]["temp"]["day"], data.daily[j]["humidity"], data.daily[j]["wind_speed"]]; // only need date, weather icon, temperature, humidity, wind speed.
                    console.log(forecastDay1);
                    for (var i = 0; i < forecastDay1.length; i++) { // nested for loop
                        if (forecastDay1[i] === forecastDay1[1]) {
                            var listItem = document.createElement("img")

                            listItem.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastDay1[i] + "@2x.png")
                            console.log(forecastDay1[i])

                        } else if (forecastDay1[i] === forecastDay1[0]) {
                         var listItem = document.createElement("li");
                        
                         listItem.textContent = moment.unix(forecastDay1[i]).format("(D/MMM/YYYY)") // parsing unix timestamp using moment.js
                         console.log(forecastDay1[i])

                        } else if (forecastDay1[i] === forecastDay1[2]) {
                         var listItem = document.createElement("li");

                         listItem.textContent = "Temp: " + forecastDay1[i] + "°C";
                         console.log(forecastDay1[i])
                        } else if (forecastDay1[i] === forecastDay1[3]) {
                         var listItem = document.createElement("li");

                         listItem.textContent = "Humidity: " + forecastDay1[i] + "%";
                         console.log(forecastDay1[i])
                        } else if (forecastDay1[i] === forecastDay1[4]) {
                         var listItem = document.createElement("li");

                         listItem.textContent = "Wind: " + forecastDay1[i] + "m/s";
                         console.log(forecastDay1[i])
                        } 

                       fiveDayForecast.appendChild(listItem); // appends to 
                    }
                }
            });
        });
    }

    // ran into dead end+++++++++++++++++++++++++++++++++++++++
    // fetch(queryURL)
    //     .then(function (response) {
    //       return response.json();
    //     })
    //     .then(function (data) {
    //       console.log(data);
        //   var array1 = [data.name, data.dt, data.weather[0]["icon"], data.main.temp, data.main.humidity, data.wind.speed];
        //   console.log(array1);
        //   var latitude = data.coord.lat;
        //   console.log(latitude);
        //   var longitude = data.coord.lon;
        //   console.log(longitude);
        //   for (var i = 0; i < array1.length; i++) { 
        //         if (array1[i] === array1[2]) {
        //             var listItem = document.createElement("img")
        //             listItem.setAttribute("src", "http://openweathermap.org/img/wn/" + array1[i] + "@2x.png")
        //             console.log(array1[i])
        //             // container.appendChild(listItem);
        //         } else {
        //             var listItem = document.createElement("li");
            
        //             listItem.textContent = array1[i];
        //             console.log(array1[i])
        //             // if (array1[i] === array1[2]) {
        //                 // var listItem = document.createElement("img")
        //                 // listItem.setAttribute("src", "http://openweathermap.org/img/wn/" + array1[2] + "@2x.png")
        //         }
        //     // http://openweathermap.org/img/wn/ + array1[i] + @2x.png

        //     container.appendChild(listItem);
            
    //       }
    //       // possibly need for loop for weather of the next five days
    //     //   for (var i = 0; i < data.length; i++) {
    //         // var element = data[i];
    //         // console.log(element.future.forecast);
    //     //   }
    //     });
    // // }

  function generateHistory() {
    var historyButton = document.createElement("button");
    historyButton.textContent = cityInputEl.value;
    capture.push(cityInputEl.value);

    localStorage.setItem("history", JSON.stringify(capture));
    console.log(capture);

    historyButton.addEventListener("click", handleSearchFormSubmit);
    searchAndHistory.appendChild(historyButton);
  }

  function getHistory() {

            capture = JSON.parse(localStorage.getItem("history")); // 
         
                for (var i = 0; i < capture.length; i++) {
                  var historyButton = document.createElement("button");
                  historyButton.setAttribute("data-search", i);
                  historyButton.textContent = capture[i];
                
                  historyButton.addEventListener("click", function(event) {
                   console.log(historyButton.textContent);
                   cityInputEl.value = historyButton.textContent;
                   console.log(cityInputEl.value);
                   handleSearchFormSubmit(event);
                  });
                  searchAndHistory.appendChild(historyButton);    

                }
        // }
    

    //   if (!capture) {
    //       capture = JSON.parse(localStorage.getItem("history"));
          
    //      for (var i = 0; i < capture.length; i++) {
    //        var historyButton = document.createElement("button");
    //        historyButton.setAttribute("data-search", i);
    //        historyButton.textContent = capture[i];

    //        historyButton.addEventListener("click", function(event) {
    //         console.log(historyButton.textContent);
    //         cityInputEl.value = historyButton.textContent;
    //         console.log(cityInputEl.value);
    //         handleSearchFormSubmit(event);
    //        });
    //        searchAndHistory.appendChild(historyButton);    
    //      }
    //   }

  }

  
  searchFormEl.addEventListener('submit', handleSearchFormSubmit);

  if (take !== null) {
      getHistory();
  }
