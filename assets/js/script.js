var apiKey = "88237246776863c0ea0178b57d538861"; // saving api key under a variable

var cityInputEl = document.querySelector('#city-input'); // selector for city input
var searchFormEl = document.querySelector('#search-form'); // selector for form
var searchAndHistory = document.querySelector(".search-and-history"); // selector for div container for seach input and history
var container = document.querySelector(".container"); // selector for div container for the forecasts

function handleSearchFormSubmit(event) {
    event.preventDefault(); // to prevent the page from refreshing
  
    var cityInputVal = cityInputEl.value; // saves the city input value into a variable
    // console.log(cityInputVal)
  
    if (!cityInputVal) { // checks if value is undefined
      console.error('Enter a city in the input field');
      return;
    }

    generateHistory();

    var getCoordinates = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInputVal + "&limit=1" + "&appid=" + apiKey; // to get the co-ordinates for making one call API
  
    // var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInputVal + "&appid=" + apiKey + "&units=metric"; // makes an API call using the citInput and the API Key
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?q=" + cityInputVal + "&appid=" + apiKey; // this will be needed for making a second call after getting the coodinates
    
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
        

            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts" + "&appid=" + apiKey + "&units=metric";

            fetch(queryURL) // making a second api call
                .then(function (response) {
                    return response.json();
            })
            .then(function (data) {
                console.log(data);
                console.log("second api call above");
                console.log(name);
                var array1 = [name, data.current.dt, data.current.weather[0]["icon"], data.current.temp, data.current.humidity, data.current.wind_speed, data.current.uvi];
                     console.log(array1);
                     for (var i = 0; i < array1.length; i++) { 
                           if (array1[i] === array1[2]) {
                               var listItem = document.createElement("img")
                               listItem.setAttribute("src", "http://openweathermap.org/img/wn/" + array1[i] + "@2x.png")
                               console.log(array1[i])
                               // container.appendChild(listItem);
                           } else {
                               var listItem = document.createElement("li");

                               listItem.textContent = array1[i];
                               console.log(array1[i])
                            }

                container.appendChild(listItem);
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

    searchAndHistory.appendChild(historyButton);
  }
  
  searchFormEl.addEventListener('submit', handleSearchFormSubmit);

// data needed... THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// 
// current, dt = data point refers to the requested time, not the current time
//
// current.dt gives Requested time, Unix, UTC (use this for date)
// current.weather.icon should give the icon for the weather condition
// current.temp gives Temperature. Units – default: kelvin, metric: Celsius, imperial: Fahrenheit. 
// 
// current.humidity gives Humidity, %
// current.uvi gives current UV index
// daily.uvi gives The maximum value of UV index for the day
// current.wind_speed Wind speed. Wind speed. Units – default: metre/sec, metric: metre/sec, imperial: miles/hour.

// fetch(queryURL)

// from stu4
// var repoList = document.querySelector('ul');
// var fetchButton = document.getElementById('fetch-button');

// function getApi() {
//   // replace `octocat` with anyone else's GitHub username
//   var requestUrl = 'https://api.github.com/users/octocat/repos';

//   fetch(requestUrl)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       for (var i = 0; i < data.length; i++) {
//         var listItem = document.createElement('li');
//         listItem.textContent = data[i].html_url;
//         repoList.appendChild(listItem);
//       }
//     });
// }

// fetchButton.addEventListener('click', getApi);


// fetch(requestUrl)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log('Github Repo Issues \n----------');
//     console.log(data);
//     // TODO: Loop through the response
//     for (let i = 0; i < data.length; i++) {
//       var element = data[i];
//       console.log(element.user.login);
//       console.log(element.user.url);
//     }
//     // TODO: Console log each issue's URL and each user's login
//   });

// var userContainer = document.getElementById('users');
// var fetchButton = document.getElementById('fetch-button');

// function getApi() {
//   var requestUrl = 'https://api.github.com/users?per_page=5';

//   fetch(requestUrl)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       // Use the console to examine the response
//       console.log(data);
//       // TODO: Loop through the data and generate your HTML
//       for (i = 0; index < data.length; i++) {
//         var user = data[i];
//         var userName = document.createElement("h3");
//         var userUrl = document.createElement("p");

//         userName.textContent = user.login;
//         userUrl.textContent = user.url;

//         userContainer.appendChild(userName)
//         userContainer.appendChild(userUrl)
        
//       }
//     });
// }
// fetchButton.addEventListener('click', getApi);

// function getApi(requestUrl) {
//     fetch(requestUrl)
//       .then(function (response) {
//         // Check the console first to see the response.status
//         console.log(response.status);
//         // Then write the conditional based on that response.status value
//         // if (response.status !== 200) {
//         if (response.status >= 400) {
//           responseText.textContent = response.status;
//         }
  
//         // Make sure to display the response on the page
//       })
//       .then(function (data) {
//         console.log(data);
//       });
//   }
  
//   getApi(badRequestUrl);