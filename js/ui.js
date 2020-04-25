define(['jquery'], function($) {
  var UI = {
    app: null,

    init: function(app){
      // reference to Trivium app:
      this.app = app;

      this.setupListeners();

      return this;
    },

    changeScreen: function(screen) {
      $('.logo').removeClass('small').removeClass('large').removeClass('none');

      if(screen==='join'){
        $('.logo').addClass('normal');
      }
      else if(screen==='room'){
        this.app.Connect.join(this.app.room, this.app.uid);
        $('.logo').addClass('none');
      }
      else if(screen==='manage'){
        if(this.app.searchParams.room) {
          this.app.Connect.join(this.app.room, this.app.uid, 'manage');
        }
        $('.logo').addClass('small');
      }
      else if(screen==='lobby'){
        $('.logo').addClass('none');
      }

      $('.screen').removeClass('active');
      $('.screen.'+screen).addClass('active');
      this.app.screen = screen;
    },

    setupListeners: function() {
      var self = this;

      $(document).on('click','.keypad_button',function(){
        var buttonEl = $(this);
        buttonEl.addClass('active');
        if(buttonEl.hasClass('join')) {
          if(buttonEl.hasClass('number')) {
            if($('.joincode_input').val().length<5) {
              $('.joincode_input').val($('.joincode_input').val() + buttonEl.html()).trigger('change');
            }
          }
          else if(buttonEl.hasClass('del')) {
            $('.joincode_input').val($('.joincode_input').val().slice(0, -1)).trigger('change');
          }
          else if(buttonEl.hasClass('go')) {
            buttonEl.addClass('disabled');
            if(buttonEl.hasClass('for_joinform')) {
              $('#joinform').trigger('submit');
            } else if(buttonEl.hasClass('for_manageform')) {
              $('#manageform').trigger('submit');
            }
          }
        }
        setTimeout(function(){
          $(buttonEl).removeClass('active');
        },150);
      });

      $('.submit_lobby', '.screen.lobby').on('click', function(e) {
        e.preventDefault();
        $('button', '.screen.lobby').addClass('disabled');
        setTimeout(function(){
          $('button', '.screen.lobby').removeClass('disabled');
        },2000);

        var dataArr = $('#lobbyform').serializeArray();
        var formdata = {};
        for (var i in dataArr) {
          formdata[dataArr[i].name] = dataArr[i].value;
        }
        var message = {
          status: 'lobby_player_update',
          room: self.app.room,
          data: formdata
        }

        self.app.Connect.send(message);
        setTimeout(function(){
          self.changeScreen('room');
        }, 500);
      });
    },

    joincodeInputChange: function() {
      if($('.joincode_input').val().length<5) {
        $('.join.keypad_button.go').addClass('disabled');
      }
      else {
        $('.join.keypad_button.go').removeClass('disabled');
      }
      if($('.joincode_input').val().length>5){
        $('.joincode_input').val($('.joincode_input').val().slice(0, -1));
      }
    },


    startPlaylist: function() {
      $('.content', '.screen.room').html('<h2>The game is about to begin!</h2>');
    },



    populateLobbyFields: function(teams, name) {
      $('#input_name').val(name);
      $('#team_list').html('');
      if(teams && teams.length>1) {
        $('.form_group.team_form').removeClass('hidden');
        rand = Math.floor(Math.random()*teams.length);
        $.each(teams, function (i, team) {
          $('#team_list').append(
            $('<div>', {
              class: 'team_button ' + ((i === rand) ? 'selected' : '')
            }).append(
              $('<input>', {
                id: "team_button_"+i,
                name: 'team',
                type: 'radio',
                value: team.name,
                checked: (i===rand) ? true : false
              }),
              $('<label for="team_button_'+i+'">'+team.name+'</label>')
            )
          );
        });
        $('input', '#team_list').change(function(){
          $('.team_button', '#team_list').removeClass('selected');
          $(this).parent('.team_button').addClass('selected');
        });
      }
    },

    userUpdateConnection: function(data){
      var self = this;

      var screentype = "normal";
      if('screen' in data && 'type' in data.screen){
        screentype = data.screen.type ? data.screen.type : screentype;
      }

      $('.connection', '.screen.room').html('');
      // if($.isArray(data.teams) && data.teams.length>0) {
      //   for (var i=0; i<data.teams.length; i++) {
      //     var t = data.teams[i];
      //     $('.connection', '.screen.room').append('<div class="team" data-team="'+t.name+'"><label>'+t.name+'<div class="score">'+(t.stats.points)+'</div></label></div>');
      //   }
      // }
      // $('.connection', '.screen.room').append('<div class="team" data-team="" style="padding-top: 24px;"></div>');

      var u = data.user;
      if(u.uid===self.app.uid) {
        $('.connection', '.screen.room').append('<div class="user"><div class="score">'+(u.stats.points)+'</div>'+(u.name)+'</div>');
      }
      if(u.team){
        $('.connection', '.screen.room').append('<div class="team">Team: <b>'+(u.team)+'</b></div>');
      }

    },

    hostUpdateConnections: function(data){
      console.log('update connections hud', data);
      var self = this;

      var screentype = "normal";
      if('screen' in data && 'type' in data.screen){
        screentype = data.screen.type ? data.screen.type : screentype;
      }
      console.log('screen type', screentype);
      $('.connections').attr('data-screentype', screentype);

      $('.connections', '.screen.room').html('');
      if($.isArray(data.teams) && data.teams.length>0) {
        for (var i=0; i<data.teams.length; i++) {
          var t = data.teams[i];
          $('.connections', '.screen.room').append('<div class="team" data-team="'+t.name+'"><label>'+t.name+'<div class="score">'+(t.stats.points)+'</div></label></div>');
        }
      }
      $('.connections', '.screen.room').append('<div class="team" data-team="" style="padding-top: 24px;"></div>');
      for(var key in data.users){
        var u = data.users[key];
        if(u.uid!==self.app.uid) {
          if (u.team && $('.team[data-team="' + u.team + '"]')) {
            $('.team[data-team="' + u.team + '"]', '.screen.room').append('<div class="user">' + (u.name) + '<div class="score">'+(u.stats.points)+'</div></div>');
          } else {
            $('.team[data-team=""]', '.screen.room').append('<div class="user">'+(u.name)+'<div class="score">'+(u.stats.points)+'</div></div>');
          }
        }
      }
    },

    renderScreen: function(screen, usertype, playerStats, teamsStats){

      if(screen.type==='playlist_start'){
        $('.content', '.screen.room').html('<h2>The game is about to begin!</h2>');
      }

      if(screen.type==='playlist_end'){
        $('.content', '.screen.room').html('<h2 style="margin-top: 150px;">Final results...</h2>');

        if($.isArray(teamsStats) && teamsStats.length>0) {

          var highestTeamScore = [];
          for (var i = 0; i < teamsStats.length; i++) {
            var team = teamsStats[i];
            // did we get a new team highscore?
            if (highestTeamScore.length === 0 || team.stats.points === highestTeamScore[0].points) {
              highestTeamScore.push({team: team.name, points: team.stats.points});
            } else if (team.stats.points > highestTeamScore[0].points) {
              highestTeamScore = [{team: team.name, points: team.stats.points}];
            }
          }
          console.log(highestTeamScore);
          var teamHtml = "TIE GAME!!!<br>";
          if (highestTeamScore.length === 1) {
            teamHtml = "WINNER!!!<br>";
          }
          for (var i = 0; i < highestTeamScore.length; i++) {
            var ht = highestTeamScore[i];
            teamHtml += '<div class="team">' + ht.team + "</div>";
          }

          $('.content', '.screen.room').append('<h2 class="teamWinner">' + teamHtml + '</h2>');
        }

        if(playerStats) {
          var topPlayers = [];
          for(var key in playerStats){
            var player = playerStats[key];
            topPlayers.push({'player': player.name, 'points': player.stats.points});
          }
          function compare(a,b) {
            if (a.points < b.points)
              return 1;
            if (a.points > b.points)
              return -1;
            return 0;
          }
          var sorted = topPlayers.sort(compare);
          var playerHtml = 'Top Players:<br>';
          var n=0;
          for(var i=0; i<sorted.length; i++){
            n++;
            if(n>4) break;
            playerHtml += '<div class="player">'+sorted[i].player+' ('+sorted[i].points+')</div>';
          }
          $('.content', '.screen.room').append('<h2 class="playerWinner">' + playerHtml + '</h2>');
        }
      }

      if(screen.type==='question'){
        var html = "";
        var self = this;
        if('question' in screen.data){
          html += '<h2>'+screen.data.question+'</h2>';
        }
        if('choices' in screen.data){
          html += '<div class="buttons">';
          for(var i=0; i<screen.data.choices.length; i++){
            var choice = screen.data.choices[i];
            html += '<button data-choice="'+i+'">'+choice+'</button>';
          }
          html += '</div>';
        }
        $('.content', '.screen.room').html(html);
        $('button', '.content').click(function(){
          var message = {
            status: 'set_answer',
            room: self.app.room,
            data: $(this).data("choice")
          }

          self.app.Connect.send(message);
          var clicked = $(this);
          clicked.addClass('active');
          setTimeout(function(){
            clicked.addClass('selected').removeClass('active');
          }, 250);
          $('button', '.content').css('pointer-events', 'none');
        })
      }

      if(screen.type==='answer'){
        var html = "";
        if('question' in screen.data){
          html += '<h2>'+screen.data.question+'</h2>';
        }
        var buttons = '';
        if($('.buttons', '.content').length){
          buttons = $('.buttons', '.content').html();
        } else {
          if('choices' in screen.data){
            buttons += '<div class="buttons">';
            for(var i=0; i<screen.data.choices.length; i++){
              var choice = screen.data.choices[i];
              buttons += '<button style="pointer-events: none;" data-choice="'+i+'">'+choice+'</button>';
            }
            buttons += '</div>';
          }
        }
        html += buttons;
        $('.content', '.screen.room').html(html);
        if('answerIndex' in screen.data){
          $('button[data-choice="'+screen.data.answerIndex+'"]', '.content').addClass('actual');
          if(usertype==='host'){
            $('button[data-choice="'+screen.data.answerIndex+'"]', '.content').addClass('selected');
          } else {
            console.log('ps', playerStats);
            if(playerStats==1){
              $('.content', '.screen.room').append('<div id="feedback" class="win">CORRECT</div>');
              setTimeout(function(){
                $('#feedback').addClass('zoom');
              },50);
              setTimeout(function(){
                $('#feedback').addClass('out');
              },3000);
            } else {
              $('.content', '.screen.room').append('<div id="feedback" class="lose">WRONG</div>');
              setTimeout(function(){
                $('#feedback').addClass('zoom');
              },50);
              setTimeout(function(){
                $('#feedback').addClass('out');
              },3000);
            }
          }
        }

        if(usertype==="host" && $.isArray(teamsStats) && teamsStats.length>0){

          setTimeout(function(){
            $('h2', '.content').css('opacity', 0);
            $('button', '.content').css('transform', 'scale(0)');
          }, 800);
          setTimeout(function(){
            console.log('teamsStats', teamsStats);
            var html = "TIE!!!";
            if(teamsStats.length===1){
              html = teamsStats[0].team + "<br>WINS!";
            }
            $('.content', '.screen.room').append('<div id="feedback" class="team">'+html+'</div>');
            setTimeout(function(){
              $('#feedback').addClass('zoom');
            },50);
            setTimeout(function(){
              $('#feedback').addClass('out');
            },6000);
          },500);
        }
      }

      if(screen.type === 'preQuestion') {
        var html = '';
        for(var key in screen.data.preQuestion) {
          let data = screen.data.preQuestion[key];
          if (data.usertype == null || (usertype && data.usertype === usertype)) {
            if(data.type === 'image') {
              if('delay' in data){
                html += '<div class="postAnswerImage hidden"><img src="' + data.src + '"></div>';
                setTimeout(function(){
                  $('.postAnswerImage').removeClass('hidden');
                }, Number(data.delay));
              } else {
                html += '<div class="postAnswerImage"><img src="' + data.src + '"></div>';
              }
            } else if (data.type === 'html') {
              html += '<div class="postAnswerContent">'+ data.value +'</div>';
            } else if (data.type === 'video') {
              html += '<video class="postAnswerVideo" autoplay>' +
                '<source src="'+data.src+'" type="video/mp4">' +
                'Your browser does not support the video tag.' +
                '</video>';
            } else if (data.type === 'iframe') {
              // doesn't look that good
              html += '<iframe width="420" height="315" src="'+ data.src +'"></iframe>'
            }
          }
        }
        $('.content', '.screen.room').html(html);
      }

      if(screen.type === 'postAnswer') {
        var html = '';
        for(var key in screen.data.postAnswer) {
          let data = screen.data.postAnswer[key];
          if (data.usertype == null || (usertype && data.usertype === usertype)) {
            if(data.type === 'image') {
              html += '<div class="postAnswerImage"><img src="'+ data.src +'"></div>';
            } else if (data.type === 'html') {
              html += '<div class="postAnswerContent">'+ data.value +'</div>';
            } else if (data.type === 'video') {
              html += '<video class="postAnswerVideo" autoplay>' +
                '<source src="'+data.src+'" type="video/mp4">' +
                'Your browser does not support the video tag.' +
                '</video>';
            } else if (data.type === 'iframe') {
              // doesn't look that good
              html += '<iframe width="420" height="315" src="'+ data.src +'"></iframe>'
            }
          }
        }
        $('.content', '.screen.room').html(html);
      }
    }
  };
  return UI;
});
