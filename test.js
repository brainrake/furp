(function(){
  var __;
  import$(this, furp);
  __ = function(it){
    console.log.apply(console, arguments);
    return it;
  };
  $(function(){
    var i$, ref$, len$, event, results$ = [];
    $('[data-signal]').each(function(i, el){
      var signal;
      return signal = eval($(el).attr('data-signal')).lift(function(it){
        return $(el).text(it);
      }).latch(100).lift(function(it){
        return $(el).toggleClass('red', it);
      });
    });
    DomEvent('click', '#lang button').lift(function(it){
      return it.target.innerText;
    }).lift(function(it){
      return $('#ct').attr('class', it);
    });
    for (i$ = 0, len$ = (ref$ = ['keydown', 'keyup', 'keypress']).length; i$ < len$; ++i$) {
      event = ref$[i$];
      results$.push(DomEvent(event).lift(fn$));
    }
    return results$;
    function fn$(it){
      var ref$;
      if ((ref$ = it.keyCode) == 37 || ref$ == 39 || ref$ == 40 || ref$ == 38 || ref$ == 32) {
        return it.preventDefault();
      }
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
