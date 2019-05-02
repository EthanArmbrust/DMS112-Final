// adapted from https://www.learnhowtoprogram.com/javascript/asynchrony-and-apis-in-javascript/making-api-calls-with-jquery
// openweathermap API http://openweathermap.org/
// backticks around strings is because template literals
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
$(document).ready(function() {
  $('#getButton').click(function() {
    let username = $('#username').val();
    let repo_count = 0;
    let avatarURL = "";
    $('#username').val("");
    $.ajax({
      url: `https://api.github.com/users/${username}`,
      //url: `http://api.openweathermap.org/data/2.5/weather?q=${city}`,
      type: 'GET', // GET because we're passing parameters in the URL
      async: false,
      data: {
        format: 'json'
      },
      success: function(response) {
        avatarURL = response.avatar_url;
        repo_count = response.public_repos;
      },
      error: function(response) {
        $('.errors').text(response.message);
        console.log("errors");
        console.log(response.message);
      }
    });
    $.ajax({
      url: `https://api.github.com/users/${username}/repos?per_page=${repo_count}`,
      //url:`file:///Users/ethanarm/DMS112-Final/repos.json`,
      type: 'GET', // GET because we're passing parameters in the URL
      data: {
        format: 'json'
      },
      success: function(response) {
        let repo_count = response.length;
        let language_list = "";
        let language_arr = [];
        let license_arr = [];
        var license_map = new Map();
        for(var i = 0; i < repo_count; i++){
          language_list += response[i].name;
          language_list += '\n';
          language_list += '   ' + response[i].language;
          language_arr.push(response[i].language);
          language_list += '\n';
          if(response[i].license != null){
            var l = response[i].license.name;
            if(!license_map.has(l)){
              license_map.set(l, 1);
            }
            else{
              license_map.set(l, license_map.get(l) + 1);
            }
          }
        }
        var unique_lan = [];
        var lang_count = [];
        for(var i = 0; i < repo_count; i++){
          if(!unique_lan.includes(language_arr[i])){
            unique_lan.push(language_arr[i]);
          }
        }
        for(var i = 0; i < unique_lan.length; i++){
          var sum = 0;
          for(var j = 0; j < repo_count; j++){
            if(language_arr[j] == unique_lan[i]){
              sum++;
            }
          }
          lang_count.push(sum);
        }

        var amount = 0;
        var best = -1;
        for(var i = 0; i < unique_lan.length; i++){
          if(amount < lang_count[i]){
            best = i;
            amount = lang_count[i];
          }
        }
        var sorted_lic = new Map([...license_map].sort((a,b) => {
            return b[1] - a[1];
        }));

        console.log(sorted_lic);

        var fav_per = Math.round((amount/repo_count) * 100);
        var fav_lic_per = Math.round((Array.from(sorted_lic.values())[0] / repo_count) * 100);

        console.log(unique_lan);
        console.log(lang_count);
        $('#content').css('display', "inline");
        $('#userAvatar').attr('src', avatarURL);
        $('#userAvatar').css('display', "inline");
        $('.username').text(`${username}`);
        $('.repoCount').text(`${username} has ${repo_count} public repositories.`)
        $('.favorite').text(`User's favorite language: ${unique_lan[best]}`);
        $('.favorite_percent').text(`${fav_per}% of ${username}'s projects are written in ${unique_lan[best]}`);
        $('.favorite_lic').text(`User's favorite license: ${Array.from(sorted_lic.keys())[0]}`);
        $('.favorite_lic_percent').text(`${fav_lic_per}% of ${username}'s projects are licensed under ${Array.from(sorted_lic.keys())[0]}`);
        $('.language_list').html(language_list).wrap('<pre />');
      },
      error: function(response) {
        $('.errors').text(response.message);
        console.log("errors");
        console.log(response.message);
      }
    });
  });
});
