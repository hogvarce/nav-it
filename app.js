"use strict"
var App = {
    jP: '#jquery_jplayer_1',
    listTrack: [],
    player: {},
    loadPlayer: function(){
        $.getJSON( "./tracks.json", function( data ) {
            App.listTrack = data;
            App.player = new jPlayerPlaylist({
        		jPlayer: App.jP,
        		cssSelectorAncestor: "#jp_container_1"
        	}, App.listTrack, {
        		swfPath: "../../dist/jplayer",
        		supplied: "oga, mp3",
        		wmode: "window",
        		useStateClassSkin: true,
        		autoBlur: false,
        		smoothPlayBar: true,
        		keyEnabled: true
        	});

            $(App.jP).bind($.jPlayer.event.progress, function (event) {
               if (event.jPlayer.status.seekPercent === 100) {
                 $('.jp-seek-bar, .jp-volume-bar').slider();
                  App.player.options.timeupdate = (function(){
                      $('.jp-seek-bar').slider("value", event.jPlayer.status.currentPercentAbsolute);
                  }());
                 App.player.options.volumechange = (function() {
                         $('.jp-volume-bar').slider("value", (event.jPlayer.options.volume * 100));
                  }());
                 App.changeSong();
                 $('.jp-playlist').mCustomScrollbar({
                     theme:"my-theme"
                 });
                } else {
                  console.log('Still loading');
                }
            });

        });
    },
    changeSong: function(){
        var activeSongInx = $('.jp-playlist-current').index();
        $('.title-track').each(function(){
            $(this).text(App.listTrack[activeSongInx].title);
        });
        $('.jp-icon img').attr('src', App.listTrack[activeSongInx].icon);
        $('#social').remove();
        $('li.jp-playlist-current').append('<span id="social"><img onclick="App.showInfo(this)" src="./jPlayer/src/skin/my/plus.png"><img onclick="App.showInfo(this)" src="./jPlayer/src/skin/my/social.png"></span>');
    },
    clickPlayToggle: function(){
        $(App.jP).bind($.jPlayer.event.play, function(event) {
            $('.jp-play').addClass("stopped");
            App.changeSong();
        });
        $(App.jP).bind($.jPlayer.event.pause, function(event) {
            $('.jp-play').removeClass("stopped");
        });
    },
    showInfo: function(item){
       var activeSongInx = $(item).parent().parent().index();
       alert('Вы слушаете трек - ' + App.listTrack[activeSongInx].title);
   }
};
