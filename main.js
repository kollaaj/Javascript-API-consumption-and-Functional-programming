const api_url = 'http://xmlweather.vedur.is?op_w=xml&type=obs&lang=en&view=xml&ids=1;422&time=3h';
async function getWeather() {
  const response = await fetch(api_url);
  const data = await response.text();
  console.log(data);
}

(async () => {
  await getWeather();
})();


// fetch('http://xmlweather.vedur.is?op_w=xml&type=obs&lang=en&view=xml&ids=1;422&time=3h')
//   .then(response => response.text())
//   .then(data => {
//     // Here's a list of repos!
//     console.log(data)
//   });

// function to handle success
// function success() {
//   var data = JSON.parse(this.responseText); //parse the string to JSON
//   console.log(data);
// }

// // function to handle error
// function error(err) {
//   console.log('Request Failed', err); //error details will be in the "err" object
// }

// var xhr = new XMLHttpRequest(); //invoke a new instance of the XMLHttpRequest
// xhr.onload = success; // call success function if request is successful
// xhr.onerror = error;  // call error function if request failed
// xhr.open('GET', 'http://xmlweather.vedur.is?op_w=xml&type=obs&lang=en&view=xml&ids=1;422&time=3h'); // open a GET request
// xhr.send(); // send the request to the server.