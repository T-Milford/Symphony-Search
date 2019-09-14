

$('.form').submit(event => {
    event.preventDefault();
    $('.content').empty();
    let query = $('.text_input').val();
    formatQueries(query);
  });

  // function sends "query" to three formatting
  function formatQueries(input) {
    youTubeFormatter(input);
    wikiFormatter(input);
    // museScoreFormatter(input);
  }

  // function formats url for YouTube query
  function youTubeFormatter(input) {
    const apiKey = "AIzaSyAqrx3UI21YR8ip4LI7dtGwW_cXa_qrg44";
    const params = {
      q: `${input}`,
      part: "snippet",
      type: "video",
      maxResults: 3,
      key: apiKey,
      order: "rating"
    }
    const youTubeBaseURL = "https://www.googleapis.com/youtube/v3/search?";
    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
    const finalYouTubeURL = youTubeBaseURL + queryString;
    console.log(finalYouTubeURL);
    YouTubeFetcher(finalYouTubeURL);
  }
  
  // function gets JSON object for YouTube query
  function YouTubeFetcher(url) {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error (response.statusText);
      })
      .then (responseJson => YouTubeDisplayer(responseJson))
      .catch(err => {
        $('.content').text(`Something went wrong: ${err.message}`)})
  }

  // function updates page using YouTube JSON object
  function YouTubeDisplayer(json) {
    for (i = 0; i < json.items.length; i++) {
      var id = json.items[i].id.videoId;
      // document.addEventListener('touchstart', onTouchStart, {passive: true}); this solution doesn't work?
      $('.content').append(`<iframe width="400" height="300" src="https://www.youtube.com/embed/${id}"></iframe><br>`)
    }
  }

function wikiFormatter(input) {
  // const params = {
  //   titles: `${input}`,
  //   format: "json",
  //   action: "query",
  //   prop: "extracts",
  //   exlimit: "max",
  //   origin: "*"
    // explaintext, exintro, redirects=
// }; 
  
  queryWikiUrl = input.replace(/ /g, "_");

  // const baseWikiUrl = 'https://en.wikipedia.org/w/api.php?explaintext&exintro&redirects=1&'
  const baseWikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
  // const queryWikiUrl = Object.keys(params).map
  //   (key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
  const finalWikiUrl = baseWikiUrl + queryWikiUrl
  wikiFetcher(finalWikiUrl);
}

function wikiFetcher(wikiUrl) {
  console.log(wikiUrl);
  fetch(wikiUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error (response.statusText);
    })
    .then (responseJson => wikiDisplayer(responseJson))
    .catch(err => {
      $('.content').text(`Something went wrong: ${err.message}`)
    })
}

function wikiDisplayer(json) {
  let wikiSummary = json.extract;
  $('.content').append(`<p>${wikiSummary}</p>`)
}


//Use THIS instead: https://en.wikipedia.org/api/rest_v1/page/summary/
// To do: 1) two inputs from user: Composer and name of piece
// All words MUST be capitalized.
// Composer MUST be in parenthesis and MUST be after piece (unless specific name like "Well Tempered Clavier", which worked)

// Problem: above format doesn't work for all pieces.  ex String_Quartet_1_Beethoven
// Problem: some videos from YouTube won't play after being loaded
