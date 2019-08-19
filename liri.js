require("dotenv").config();

var axios = require("axios");

var app = process.argv[2];
var input = process.argv[3];

switch (app) {
  case "concert-this":
    bands();
    break;
  case "spotify-this-song":
    music();
    break;
  case "movie-this":
    movie();
    break;
  case "do-what-it-says":
    directions();
  default:
    break;
}

// OMDB Movie Api
function movie() {
  // Calling the OMDB API
  axios
    .get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
      // Objects stores the movie data
      var movieInfo = {
        title: response.data.Title,
        year: response.data.Year,
        rating: response.data.imdbRating,
        rotten: response.data.Metascore,
        country: response.data.Country,
        language: response.data.Language,
        plot: response.data.Plot,
        actors: response.data.Actors
      };

      console.log(
        `\nTitle:  ${movieInfo.title} \nYear: ${
          movieInfo.year
        } \nIMDB Rating: ${movieInfo.rating} \nRotten Tomatoes Rating: ${
          movieInfo.rotten
        } \nCountry: ${movieInfo.country} \nLanguage: ${
          movieInfo.language
        } \nPlot: ${movieInfo.plot} \nActors: ${movieInfo.actors}\n`
      );
    });
}
// Bands In Town Api
function bands() {
  // Creating the variable to grab the user input
  var bandAPI =
    "https://rest.bandsintown.com/artists/" +
    input +
    "/events?app_id=codingbootcamp";
  var moment = require("moment");
  moment().format();

  axios.get(bandAPI).then(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      event = response.data[i];
      name = event.venue.name;
      date = moment(event.datetime).format("MM/DD/YYYY");
      // console.log(response.data[0]);
      console.log(
        "\nVenue: " +
          name +
          "\nLocation: " +
          event.venue.city +
          ", " +
          event.venue.region +
          "\nDate: " +
          date +
          "\n-----------------"
      );
    }
  });
}
// Spotify Search Api
function music() {
  // creating a variable to grab the user input
  var song = process.argv[3];

  var Spotify = require("node-spotify-api");
  var keys = require("./keys.js");
  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: "track", query: input }, function(err, data) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    }
    songInfo = data.tracks.items;
    // Creating a for loop to loop through the data
    for (var i = 0; i < songInfo.length; i++) {
      // Creating variables to store information from the API
      var album = songInfo[i].album.name;
      var name = songInfo[i].name;
      var url = songInfo[i].preview_url;
      var artist = songInfo[i].artists[0].name;
      console.log(
        "\nSong Title: " +
          name +
          "\nArtist(s) Name: " +
          artist +
          "\nAlbum Name: " +
          album +
          "\nPreview Url: " +
          url +
          "\n--------------"
      );
    }
  });
}
function directions() {
  var fs = require("fs");
  var Spotify = require("node-spotify-api");
  var keys = require("./keys.js");
  var spotify = new Spotify(keys.spotify);

  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
    }
    console.log(data);

    var dataArr = data.split(",");

    if ((dataArr[0] = "spotify-this-song")) {
      console.log(dataArr[1]);
      var thatway = dataArr[1];

      spotify.search({ type: "track", query: thatway }, function(err, data) {
        if (err) {
          return console.log("Error occurred: " + err);
        } else {
          var songInfo = data.tracks.items;
          console.log("Artist");
          console.log(songInfo[0].artists[0].name);
          console.log("Song");
          console.log(songInfo[0].name);
          console.log("Preview");
          console.log(songInfo[0].external_urls.spotify);
          console.log("Album");
          console.log(songInfo[0].album.name);
        }
      });
    }
  });
}
