// adapted from https://www.learnhowtoprogram.com/javascript/asynchrony-and-apis-in-javascript/making-api-calls-with-jquery
// openweathermap API http://openweathermap.org/
// backticks around strings is because template literals
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
$(document).ready(function() {
  $('#getButton').click(function() {
    let username = $('#username').val();
    $('#username').val("");
    $.ajax({
      url: `https://api.github.com/users/${username}/repos`,
      //url: `http://api.openweathermap.org/data/2.5/weather?q=${city}`,
      type: 'GET', // GET because we're passing parameters in the URL
      data: {
        format: 'json'
      },
      success: function(response) {
        let repo_count = response.length;
        let language_list = "";
        for(var i = 0; i < repo_count; i++){
          language_list += response[i].name;
          language_list += '\n';
          language_list += '   ' + response[i].language;
          language_list += '\n';
        }
        $('.repoCount').text(`${username} has ${repo_count} public repositories.`)
        $('.showHumidity').text(`The first listed repo of ${username} is ${response[0].name}`);
        $('.showTemp').html(language_list).wrap('<pre />');
      },
      error: function() {
        $('#errors').text("There was an error processing your request. Please try again.");
        console.log("errors");
      }
    });
    $.ajax({
      url: `https://api.github.com/users/${username}`,
      //url: `http://api.openweathermap.org/data/2.5/weather?q=${city}`,
      type: 'GET', // GET because we're passing parameters in the URL
      data: {
        format: 'json'
      },
      success: function(response) {
        let avatarURL = response.avatar_url;
        $('#userAvatar').attr('src', avatarURL);
      },
      error: function() {
        $('#errors').text("There was an error processing your request. Please try again.");
        console.log("errors");
      }
    });
  });
});
