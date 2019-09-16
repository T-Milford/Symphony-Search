

$('.form').submit(event => {
    event.preventDefault();
    $('.content').empty();
    let composerQuery = $('.composer_input').val();
    let pieceQuery = $('.piece_input').val();
    formatQueries(composerQuery, pieceQuery);
  });

  // function sends both parts of query to two formatting functions
  function formatQueries(composer, piece) {
    wikiFormatter(composer, piece);
    youTubeFormatter(composer, piece);
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
        $('.content').text(`Something went wrong: ${err.message}`)})
  }

  // function updates page using YouTube JSON object
  function YouTubeDisplayer(json) {
    console.log(json);
    for (i = 0; i < json.items.length; i++) {
      var id = json.items[i].id.videoId;
      $('.content').append(`<iframe width="400" height="300" src="https://www.youtube.com/embed/${id}"></iframe><br>`)
    }
  }

function wikiFormatter(composer, piece) {
  if (composer) {
    let queryWikiUrl = `${piece} (${composer})`.replace(/ /g, "_");
    const baseWikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
    const finalWikiUrl = baseWikiUrl + queryWikiUrl;
    wikiFetcher(finalWikiUrl);
  }
  else {
    let queryWikiUrl = `${piece}`.replace(/ /g, "_");
    const baseWikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
    const finalWikiUrl = baseWikiUrl + queryWikiUrl;
    wikiFetcher(finalWikiUrl);
  }
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
      $('.content').text(`No results found in WikiPedia with your input.  Try entering your request differently.`)
    })
}

function wikiDisplayer(json) {
  console.log(json);
  let wikiSummary = json.extract;
  let wikiTitle = json.titles.display;
  $('.content').append(`<h1>${wikiTitle}</h1>`)
  $('.content').append(`<p>${wikiSummary}</p>`)
  if (json.originalimage.source) {
    $('.content').append(`<p><img src="${json.originalimage.source}"></p>`)
  }
}



// To do: 
  // 3) use Promise.all {fetchers}.... .then (load stuff)
