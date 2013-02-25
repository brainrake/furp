(function(){
  var __;
  import$(this, furp);
  __ = function(it){
    console.log.apply(console, arguments);
    return it;
  };
  $(function(){
    var i$, ref$, len$, e, results$ = [];
    $('[data-signal]').each(function(i, el){
      var signal;
      return signal = eval($(el).attr('data-signal')).lift(function(it){
        $(el).text(it);
        return $(el).addClass('red');
      }).latch(100).keepIf(function(it){
        return !it;
      }).lift(function(){
        return $(el).removeClass('red');
      });
    });
    DomEvent('click', '#lang button').lift(function(it){
      return it.target.innerText;
    }).lift(function(it){
      var i$, ref$, len$, cls;
      for (i$ = 0, len$ = (ref$ = ['js', 'cs', 'ls', 'all']).length; i$ < len$; ++i$) {
        cls = ref$[i$];
        $('#ct').removeClass(cls);
      }
      return $('#ct').addClass(it);
    });
    for (i$ = 0, len$ = (ref$ = ['keydown', 'keyup', 'keypress']).length; i$ < len$; ++i$) {
      e = ref$[i$];
      results$.push($(document).on(e, fn$));
    }
    return results$;
    function fn$(it){
      var ref$;
      if ((ref$ = it.keyCode) == 37 || ref$ == 39 || ref$ == 40 || ref$ == 38 || ref$ == 32) {
        it.preventDefault();
      }
      return true;
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
