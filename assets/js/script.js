var apiKey = "88237246776863c0ea0178b57d538861"; // saving api key under a variable

var cityInputEl = document.querySelector('#city-input'); // selector for city input
var searchFormEl = document.querySelector('#search-form'); // selector for form

function handleSearchFormSubmit(event) {
    event.preventDefault(); // to prevent the page from refreshing
  
    var cityInputVal = cityInputEl.value; // saves the city input value into a variable
    console.log(cityInputVal)
  
    if (!cityInputVal) { // checks if value is undefined
      console.error('Enter a city in the input field');
      return;
    }
  
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInputVal + "&appid=" + apiKey; //makes an API call using the citInput and the API Key
    console.log(queryURL)

    cityInputEl.textContent = "" // clears text input
  
    location.assign(queryURL);
  }
  
  searchFormEl.addEventListener('submit', handleSearchFormSubmit);

