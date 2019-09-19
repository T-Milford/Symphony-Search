

$('.form').submit(event => {
    event.preventDefault();
    $('.wikiTitle, .wikiSummary, .wikiImage, .youTubeContent').empty();
    let composerQuery = $('.composer_input').val();
    capComposer = composerQuery.charAt(0).toUpperCase() + composerQuery.slice(1).toLowerCase();
    let pieceQuery = $('.piece_input').val();
    formatQueries(capComposer, pieceQuery);
  });

  // function sends both parts of query to two formatting functions
  function formatQueries(composer, piece) {
    wikiFormatter(composer, piece);
    youTubeFormatter(composer, piece);
  }

function wikiFormatter(composer, piece) {
  if (composer) {
    let queryWikiUrl = `${piece} (${composer})`.replace(/ /g, "_");
    const baseWikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
    const finalWikiUrl = baseWikiUrl + queryWikiUrl;
    console.log(finalWikiUrl);
    wikiFetcher(finalWikiUrl);
  }
  else {
    let queryWikiUrl = `${piece}`.replace(/ /g, "_");
    const baseWikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
    const finalWikiUrl = baseWikiUrl + queryWikiUrl;
    wikiFetcher(finalWikiUrl, piece);
  }
} 

function wikiFetcher(wikiUrl) {
  fetch(wikiUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      //not sure how below line works
      throw new Error (response.statusText);
    })
    .then (responseJson => wikiDisplayer(responseJson))
    .catch(err => {
      $('.wikiTitle').append(
      `<div class="instructions"><h3>No results found in Wikipedia with your input.</h3>  
      <h3>How to use:</h3>
      <ul class="instructions_list">
        <li>If title of piece is unique (i.e. "Well-Tempered Clavier"): do NOT include composer name.</li>
        <li>...but if title of piece is NOT unique (i.e. "Symphony No. 9"): DO include composer name!</li>
        <li>Finally: if title of piece is numerical, include "No. 1" (with period!) etc in title.</li>
      </ul>
    </div>.`)
    })
}

function wikiDisplayer(json) {
  console.log(json);
  let wikiSummary = json.extract;
  let wikiTitle = json.titles.display;
  $('.wikiTitle').append(`<h2>${wikiTitle}</h2>`)
  if (json.originalimage) {
    $('.wikiImage').append(`<p><img class="appendedImage" src="${json.originalimage.source}"></p>`)
  }
  $('.wikiSummary').append(`<p class="appendedSummary">${wikiSummary}</p>`)  
}

  // function formats url for YouTube query
  function youTubeFormatter(composer, piece) {
    const apiKey = "AIzaSyAqrx3UI21YR8ip4LI7dtGwW_cXa_qrg44";
    const params = {
      q: `${composer} ${piece}`,
      part: "snippet",
      type: "video",
      maxResults: 3,
      key: apiKey,
      order: "relevance"
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
        $('.youTubeContent').text(`Something went wrong with YouTube search.}`)})
  }

  // function updates page using YouTube JSON object
  function YouTubeDisplayer(json) {
    console.log(json);
    for (i = 0; i < json.items.length; i++) {
      var id = json.items[i].id.videoId;
      $('.youTubeContent').append(`<iframe class="appendedVideo" width="400" height="300" src="https://www.youtube.com/embed/${id}"></iframe><br>`)
    }
  }

// To do: 

  // 2) Create logic for "if no match (i.e. Bach + Well-Tempered Clavier), try without composer"
  // if 


