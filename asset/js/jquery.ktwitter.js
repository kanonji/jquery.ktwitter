(function($){
  var settings = {
    screen_name: undefined,
    count: 10,
  };
  var methods = {
    init: function( options ) {
      this.each( function(){
        if ( options ) {
          console.info(options);
          extend( settings, options );
          console.info(settings);
        }
      });
      console.info(this);
      return methods.load.apply( this, arguments );
    },
    load: function( options ) {
      console.info(this);
      return this.each(function(){
        if ( options ) {
          extend( settings, options );
        }
        var element = this;
        $.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?callback=?', {
          screen_name: settings.screen_name,
          count: settings.count
        }, function( result ){
          element.ktwitters = result;
        });
      });
    },
    reload: function() {
      return this.each(function(){
        //TODO stab
      });
    }
  };

  var extend = function( settings, options ) {
    return $.extend( settings, options );
  };

  $.fn.ktwitter = function( method ){
    if ( methods[method] ) {
      console.log(this);
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
    } else if ( typeof method === 'object' || ! method ) {
      console.log(this);
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' + method + 'does not exist on jQuery.ktwitter' );
    }
  };
})(jQuery);
/* vim: set ts=2 sw=2 sts=2 et ff=unix ft=javascript : */
