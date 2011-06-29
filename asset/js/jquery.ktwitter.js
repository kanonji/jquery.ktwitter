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
      console.info(arguments);
      return methods.load.apply( this, arguments );
    },
    load: function( options ) {
      console.info(this);
      var $this = this;
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
          methods.render.apply( $this, arguments );
        });
      });
    },
    reload: function() {
      return this.each(function(){
        //TODO stab
      });
    },
    render: function(){
      console.info(this);
      console.info(arguments);
      var data = this.get(0).ktwitters;
      var ul = $('<ul>');
      var template = '<li class="clearfix"><img src="{{icon}}" class="picture"><div class="text"><p class="tweet"><span>{{screen_name}}</span>{{text}}</p><p class="date">{{datetime}}</p></div></li>';
      var item;
      for( var i in data ){
        item = {
          icon: data[i].user.profile_image_url,
          screen_name: data[i].user.screen_name,
          text: data[i].text,
          datetime: _relative_time(data[i].created_at)
        };
        ul.append(_render(item, template));
      }
      this.append(ul);
    },
    setRender: function( func ){
      methods.render = func;
    }
  };

  var extend = function( settings, options ) {
    return $.extend( settings, options );
  };

  function _relative_time(time_value) {
    var values = time_value.split(" ");
    time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
    delta = delta + (relative_to.getTimezoneOffset() * 60);

    if (delta < 60) {
      return 'less than a minute ago';
    } else if(delta < 120) {
      return 'about a minute ago';
    } else if(delta < (60*60)) {
      return (parseInt(delta / 60)).toString() + ' minutes ago';
    } else if(delta < (120*60)) {
      return 'about an hour ago';
    } else if(delta < (24*60*60)) {
      return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
    } else if(delta < (48*60*60)) {
      return '1 day ago';
    } else {
      return (parseInt(delta / 86400)).toString() + ' days ago';
    }
  }

  function _render(item, template){
    for(var key in item){
      item[key] = (item[key] === undefined) ? '' : item[key];
      var rgx = new RegExp('{{' + key + '}}', 'g');
      template = template.replace(rgx, item[key]);
    }
    return template;
  }

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
