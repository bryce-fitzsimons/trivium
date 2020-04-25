define(['ui', 'connect', 'manage', 'questionbank', 'jquery'], function(UI, Connect, Manage, QuestionBank, $){
  var Trivium = {
    searchParams: {},
    session: '',
    uid: '',
    room: '',
    playlistScreen: {
      id: null
    },
    screen: '',

    init: function() {
      // reference to modules:
      this.UI = UI.init(this);
      this.Connect = Connect.init(this);
      this.Manage = Manage.init(this);
      this.QuestionBank = QuestionBank.init(this);

      this.uid = this.session;
      this.searchParams = this.getSearch();
      this.room = ('room' in this.searchParams) ? this.searchParams.room : '';

      if (!this.searchParams.p && this.searchParams.room) {
        this.UI.changeScreen('room');
      } else if(this.searchParams.p && this.searchParams.p==='manage') {
        this.UI.changeScreen('manage');
      } else if(this.searchParams.p && this.searchParams.p==='lobby') {
        this.UI.changeScreen('lobby');
      } else {
        this.UI.changeScreen('join');
      }

      return this;
    },

    getSearch: function() {
      var searchParams = {};
      if(document.location.search!=='') {
        var tmp = document.location.search.substr(1).split('&');
        for (var i = 0; i < tmp.length; i++) {
          var arr = tmp[i].split('=');
          searchParams[arr[0]] = arr[1];
        }
      }
      return searchParams;
    },

  };

  return Trivium;
});