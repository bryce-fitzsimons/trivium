define(['jquery'], function($) {
  var Connect = {
    app: null,

    wsEndpoint: 'ws://localhost:40500',
    ws: null,
    pingInterval: null,

    init: function(app){
      // reference to Trivium app:
      this.app = app;
      this.wsEndpoint = (window.location.protocol==='https:'?'wss':'ws')+'://'+app.serverName+':40500';

      this.join = this.join.bind(this);
      this.onMessage = this.onMessage.bind(this);
      this.onClose = this.onClose.bind(this);

      return this;
    },

    join: function(joincode, uid, command){
      if(this.ws!==null){
        return;
      }
      var self = this;
      var pingInterval = null;

      if(!uid){
        self.ws = new WebSocket(this.wsEndpoint+'/?joincode='+joincode);
      } else {
        if(command){
          self.ws = new WebSocket(this.wsEndpoint+'/?joincode=' + joincode + '&uid=' + uid + '&command=' + command);
        } else {
          self.ws = new WebSocket(this.wsEndpoint+'/?joincode=' + joincode + '&uid=' + uid);
        }
      }

      // event emitted when connected
      self.ws.onopen = function (event) {
        console.log('websocket is connected ...');

        self.pingInterval = setInterval(function(){
          self.ws.send(JSON.stringify({status: 'ping'}));
        }, 2000);
      }

      self.ws.onclose = this.onClose;
      self.ws.onmessage = this.onMessage;

    },

    send: function(data){
      this.ws.send(JSON.stringify(data));
    },

    onMessage: function(event){
      var self = this;
      try {
        var message = JSON.parse(event.data);
      } catch(error) {
        console.warn('malformed message:', event.data);
        return;
      }
      console.log(message);

      if(message.status==='roommanage'){
        if(message.data.status===1){
          $('h2.title', '.screen.manage').html('Managing room '+self.app.room);
          $('.status', '.screen.manage').css('opacity', 1).html(message.message);
          setTimeout(function(){
            $('.status', '.screen.manage').css('opacity', 0);
          }, 1000);
          var playlist = ('playlist' in message.data) ? message.data.playlist : null;
          var teams = ('teams' in message.data) ? message.data.teams : null;
          var payload = {
            playlist: playlist,
            teams: teams
          };
          self.app.Manage.showManageTools(payload);
        } else {
          $('.error', '.screen.manage').css('opacity', 1).html(message.message);
          setTimeout(function(){
            window.location.href='/trivium';
          }, 1000);
        }
      }

      else if(message.status==='roommanage_update'){
        if(message.data.status===1){
          self.app.Manage.saved(message);
        }
      }

      else if(message.status==='playlist_start'){
        this.app.UI.startPlaylist();
      }
      // else if(message.status==='playlist_next'){
      //   this.app.UI.nextSection(message.data);
      // }

      if(message.status==='roomstatus') {
        var host = false;
        if('usertype' in message.data && message.data.usertype==='host'){
          host = true;
          $('.controls', '.screen.room').removeClass('hidden');
          $('.roomstatus', '.screen.room').removeClass('hidden');

          self.app.UI.hostUpdateConnections(message.data);
          
          $('.next', '.screen.room').off().on('click', function(e){
            $('.next', '.screen.room').addClass('disabled');
            setTimeout(function(){
              $('.next', '.screen.room').removeClass('disabled');
            }, 200);
            self.app.Manage.next(e);
          });
        }
        if(!host && 'user' in message.data) {
          if(!message.data.user.seenLobby) {
            // route to lobby
            if (this.app.screen === 'room') {
              this.app.UI.changeScreen('lobby');
              this.app.UI.populateLobbyFields(message.data.teams, message.data.user.name);
            }
          }

          self.app.UI.userUpdateConnection(message.data);
        }
        // handle playlist screen
        if('screen' in message.data){

          this.app.playlistScreen = message.data.screen;
          if (message.data.screen.name === 'playlist_start') {
            self.app.screen = message.data.screen;
            this.app.UI.startPlaylist();
          }
          else if (message.data.screen.id === 'playlist_end') {
            self.app.screen = message.data.screen;
            self.app.UI.renderScreen(
              self.app.screen,
              message.data.usertype,
              'users' in message.data ? message.data.users : null,
              'teams' in message.data ? message.data.teams : null
            );
          }
          else {
            // handle generic renders!!!!!!
            if(self.app.screen.id !== message.data.screen.id) {
              self.app.screen = message.data.screen;
              self.app.UI.renderScreen(
                self.app.screen,
                message.data.usertype,
                'playerStats' in message.data ? message.data.playerStats : null,
                'teamsStats' in message.data ? message.data.teamsStats : null
              );
            }
          }

        }
      }
    },

    onClose: function(event){
      clearInterval(this.pingInterval);
    }

  };
  return Connect;
});
