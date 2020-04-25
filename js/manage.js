define(['jquery'], function($) {
  var Manage = {
    app: null,

    init: function(app){
      // reference to Trivium app:
      this.app = app;

      return this;
    },

    showManageTools: function(payload) {
      var self = this;
      $('.tools', '.screen.manage').css('opacity', 1);

      if('playlist' in payload){
        for(var key in payload.playlist){
          var val = payload.playlist[key];
          if(key==='content'){
            key = "contentTextArea";
            val = JSON.stringify(val, null, 2);
          }
          $('#'+key).val(val);
        }
      }
      // temp:
      // setTimeout(function(){
      //   $('.import', '.screen.manage').click();
      // },200);

      if('teams' in payload){
        var val = '';
        if($.isArray(payload.teams)) {
          var val = payload.teams.join("\n");
        }
        $('#playlist_teams').val(val);
      }
      // temp:
      // $('#playlist_teams').val("alpha\ngamma");

      // Save
      $('#manage_playlist').submit(function(e){
        self.save(e);
      });

      // Playlist controls
      $('.next', '.screen.manage').on('click', function(e){
        self.next(e);
      });

      // Dumb question importer
      $('.import', '.screen.manage').on('click', function() {
        var payload = self.app.QuestionBank.getQuestions();
        var questionArr = [];
        for(var key in payload){
          questionArr.push(payload[key]);
        }
        $('#contentTextArea').val(JSON.stringify(questionArr, null, 2));
      });
    },

    next: function(e){
      var self = this;
      $('.next', '.screen.manage').addClass('disabled');
      setTimeout(function(){
        $('.next', '.screen.manage').removeClass('disabled');
      }, 500);
      var message = {
        status: 'manage_playlist_next',
        room: self.app.room
      };
      self.app.Connect.send(message);
    },

    save: function(e){
      var self = this;
      e.preventDefault();

      $('button', $('#manage_playlist')).addClass('disabled');
      setTimeout(function(){
        $('button', $('#manage_playlist')).removeClass('disabled');
      },2000);

      var dataArr = $('#manage_playlist').serializeArray();
      var formdata = {playlist:{}, teams: null};
      for (var i in dataArr) {
        if(dataArr[i].name==='teams'){
          formdata.teams = dataArr[i].value;
        } else {
          formdata.playlist[dataArr[i].name] = dataArr[i].value;
        }
      }
      var message = {
        status: 'manage_playlist_update',
        room: self.app.room,
        data: formdata
      }
      console.log('saving...', message);

      self.app.Connect.send(message);
    },

    saved: function(message) {
      setTimeout(function() {
        $('button', $('#manage_playlist')).removeClass('disabled');
      }, 200);
      $('.save_status', '.screen.manage').css('opacity', 1).html(message.message);
      setTimeout(function(){
        $('.save_status', '.screen.manage').css('opacity', 0);
      }, 2000);
      if('playlist' in message.data){
        for(var key in message.data.playlist){
          $('#'+key).val(message.data.playlist[key]);
        }
      }
    }

  };
  return Manage;
});