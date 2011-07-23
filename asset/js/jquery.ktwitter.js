(function($){
  var settings = {
    screen_name: undefined,
    count: 10,
    //render: function(){},
    autoLoad: true,
    autoRender: true
  };
  var methods = {
    init: function( options ) {
      this.each( function(){
        if ( options ) {
          $.extend( settings, options );
        }
        this.ktwitter = {};
        this.ktwitter.apply = _apply;
        this.ktwitter.relativeTime = _relativeTime;

      });
      if ( settings.render )
        methods.setRender.call( this, settings.render );
      if ( settings.autoLoad )
        return methods.load.apply( this, arguments );
    },
    load: function( options ) {
      return this.each(function(){
        if ( options ) {
          $.extend( settings, options );
        }
        var self = this;
        $.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?callback=?', {
          screen_name: settings.screen_name,
          count: settings.count
        }, function( result ){
          $.extend( self.ktwitter, result );
          if ( settings.autoRender )
            _render.call( self, result);
        });
      });
    },
    reload: function() {
      return this.each(function(){
        //TODO stab
      });
    },
    rerender: function( func ) {
      if ( func )
        methods.setRender.call(this, func);
      return this.each(function(){
        $(this).empty();
        _render.call( this, this.ktwitter );
      });
    },
    setRender: function( func ){
      _render = func;
      return this;
    },
    destroy: function(){
      //TODO stab
      return this;
    }
  };

  var _render = function(data) {
      var ul = $('<ul>');
      var template = '<li class="clearfix"><img src="{{icon}}" class="picture"><div class="text"><p class="tweet"><span>{{screen_name}}</span>{{text}}</p><p class="date">{{datetime}}</p></div></li>';
      var item;
      for( var i in data ){
        item = {
          icon: data[i].user.profile_image_url,
          screen_name: data[i].user.screen_name,
          text: data[i].text,
          datetime: this.ktwitter.relativeTime(data[i].created_at)
        };
        ul.append( this.ktwitter.apply(item, template) );
      }
      $(this).append(ul);
  };

  var _relativeTime = function(time_value) {
    var values = time_value.split(" ");
    time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);
    delta = delta + (relative_to.getTimezoneOffset() * 60);

    if (delta < 60) {
      return 'less than a minute ago';
    } else if(delta < 120) {
      return 'about a minute ago';
    } else if(delta < (60*60)) {
      return (parseInt(delta / 60, 10)).toString() + ' minutes ago';
    } else if(delta < (120*60)) {
      return 'about an hour ago';
    } else if(delta < (24*60*60)) {
      return 'about ' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
    } else if(delta < (48*60*60)) {
      return '1 day ago';
    } else {
      return (parseInt(delta / 86400, 10)).toString() + ' days ago';
    }
  };

  var _apply = function(item, template){
    for(var key in item){
      item[key] = (item[key] === undefined) ? '' : item[key];
      var rgx = new RegExp('{{' + key + '}}', 'g');
      template = template.replace(rgx, item[key]);
    }
    return template;
  };

  $.fn.ktwitter = function( method ){
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' + method + 'does not exist on jQuery.ktwitter' );
    }
  };
})(jQuery);
/* vim: set ts=2 sw=2 sts=2 et ff=unix ft=javascript : */
