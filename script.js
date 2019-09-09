$('.form').submit(event => {
    event.preventDefault();
    $('.content').empty();
    let query = $('.text_input').val();
    formatQueries(query);
  });

  // function sends "query" to three formatting
  function formatQueries(input) {
    youTubeFormatter(input);
    // wikiFormatter(input);
    // museScoreFormatter(input);
  }

  // function formats url for YouTube query
  function youTubeFormatter(input) {
    const apiKey = "AIzaSyAqrx3UI21YR8ip4LI7dtGwW_cXa_qrg44";
    const params = {
      q: `${input}`,
      part: "snippet",
      type: "video",
      maxresults: 5,
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
    for (i = 0; i < json.items.length; i++)
      var id = json.items[i].id.videoId;
      $('.content').append(`<iframe width="400" height="300" src="https://www.youtube.com/embed/${id}"></iframe><br>`)
      console.log(id);
  }

  // <iframe width="400" height="300" src="https://www.youtube.com/embed/${id}"></iframe>

  // let videoId = ${json.items[i].id.videoId};