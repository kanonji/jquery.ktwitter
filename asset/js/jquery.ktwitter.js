(function($){
  var settings = {
    screen_name: undefined,
    count: 10,
  };
  var methods = {
    init: function( options ){
      return this.each( function(){
        if ( options ) {
          extend( settings, options );
        }
        methods.load();
      });
    },
    load: function( options ){
      return this.each(){
        if ( options ) {
          extend( settings, options );
        }
        $.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?callback=?', {
          screen_name: settings.screen_name,
          count: settings.count
        }, function( result ){
          $(this).ktwitter = result;
        });
      };
    },
    reload: function(){
      return this.each(){
        //TODO stab
      };
    },
  };

  var extend = function( options ) {
    $.extend( settings, options );
  }

  $.fn.ktwitter = function( method ){
    if ( methods ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' + method + 'does not exist on jQuery.ktwitter' );
    }
  };
})(jQuery);
/* vim: set ts=2 sw=2 sts=2 et ff=unix ft=javascript : */
