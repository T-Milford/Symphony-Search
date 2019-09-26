

$('.form').submit(event => {
    event.preventDefault();
    $('.wikiTitle, .wikiSummary, .wikiImage, .youTubeContent').empty();
    let composerQuery = $('.composer_input').val();
    capComposer = composerQuery.charAt(0).toUpperCase() + composerQuery.slice(1).toLowerCase();
    let pieceQuery = $('.piece_input').val();
    formatQueries(capComposer, pieceQuery);
    
    $('html,body').animate({
      scrollTop: $(".content").offset().top},
      'slow');
  });

  // function sends both parts of query to two formatting functions
  function formatQueries(composer, piece) {
    wikiFormatter(composer, piece);
    youTubeFormatter(composer, piece);
  }

function wikiFormatter(composer, piece) {
    let queryWikiUrl = `${piece} (${composer})`.replace(/ /g, "_");
    const baseWikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/symphony_No._'
    const finalWikiUrl = baseWikiUrl + queryWikiUrl;
    wikiFetcher(finalWikiUrl);
}

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
    YouTubeFetcher(finalYouTubeURL);
  }

// gets JSON object for Wiki query
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
      `<div class="instructions"><h3>No results found in Wikipedia.</h3>  
      <h3>Please:</h3>
      <ul class="instructions_list">
        <li>Verify that you have spelled last name correctly.</li>
        <li>Verify that your composer wrote a symphony of that number.</li>
        <li>See YouTube results below for ideas.</li>
      </ul>
    </div>.`)
    })
}

// gets JSON object for YouTube query
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
      $('.youTubeContent').text(`Quota limit exceeded for YouTube search.  Try again later.`)})
}

// updates page with Wiki content from associated JSON object
function wikiDisplayer(json) {
  let wikiSummary = json.extract;
  let wikiTitle = json.titles.display;
  $('.wikiTitle').append(`<h1>${wikiTitle}</h1>`)
  if (json.originalimage) {
    $('.wikiImage').append(`<p><img class="appendedImage" src="${json.originalimage.source}" alt="Image of composer, score, etc."></p>`)
  }
  $('.wikiSummary').append(`<p class="appendedSummary">${wikiSummary}</p>`)  
}

// updates page with YouTube content from associated JSON object
function YouTubeDisplayer(json) {
    for (i = 0; i < json.items.length; i++) {
      var id = json.items[i].id.videoId;
      $('.youTubeContent').append(`<iframe class="appendedVideo" width="250" height="200" src="https://www.youtube.com/embed/${id}"></iframe><br>`)
    }
  }