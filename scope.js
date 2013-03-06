(function(){
  var getctx;
  getctx = function(size){
    var el, ctx;
    if (!$('#__signals')[0]) {
      $('body').append("<div id='__signals' style='position:fixed;height:100%;width:100%;'></div>");
    }
    $('#__signals').append(el = $("<canvas height='" + size + "' width='" + size + "' style='float:right;top:0;left:0;height:" + size + "px;width:" + size + "px;'>"));
    return ctx = el[0].getContext('2d');
  };
  furp.SignalClass.prototype.___ = function(title, size){
    var ctx, memo;
    title == null && (title = '');
    size == null && (size = 100);
    ctx = getctx(size);
    memo = [];
    this.lift(function(it){
      var x$, range, i$, len$, m, maxabs, i, y$, z$, z1$, x, h, y, z2$, z3$;
      memo.splice(0, 0, it);
      if (memo.length === 101) {
        memo = memo.slice(0, 100);
      }
      x$ = ctx;
      x$.fillStyle = '#000';
      x$.fillRect(0, 0, 100, 100);
      x$.font = '9px sans-serif';
      x$.textBaseline = 'top';
      if (_.isArray(it)) {
        range = [[0, 0], [0, 0]];
        for (i$ = 0, len$ = memo.length; i$ < len$; ++i$) {
          m = memo[i$];
          switch (false) {
          case !(m[0] < range[0][0]):
            range[0][0] = m[0];
            break;
          case !(m[0] > range[1][0]):
            range[1][0] = m[0];
            break;
          case !(m[1] < range[0][1]):
            range[0][1] = m[1];
            break;
          case !(m[1] > range[1][1]):
            range[1][1] = m[1];
          }
        }
        maxabs = maximum(map(abs, _.flatten(range)));
        for (i$ = min(64, memo.length - 1); i$ >= 0; --i$) {
          i = i$;
          if (memo[i] == null) {
            continue;
          }
          y$ = ctx;
          y$.strokeStyle = '#2' + (16 - Math.round(i / 4)).toString(16) + '2';
          y$.beginPath();
          y$.moveTo(50.5, 50.5);
          y$.lineTo(50.5 + memo[i][0] / (maxabs || 1) * 100, 50.5 - memo[i][1] / (maxabs || 1) * 100);
          y$.stroke();
        }
        z$ = ctx;
        z$.strokeStyle = '#fff';
        z$.beginPath();
        z$.moveTo(50.5, 50.5);
        z$.lineTo(50.5 + memo[0][0] / (maxabs || 1) * 100, 50.5 - memo[0][1] / (maxabs || 1) * 100);
        z$.stroke();
        z$.fillStyle = '#fff';
        z$.fillText(title + '  ' + map(function(it){
          return it.toFixed(3);
        }, it).toString(), 0, 0);
        return z$;
      } else {
        z1$ = ctx;
        z1$.fillStyle = '#2f2';
        maxabs = maximum(map(abs, memo));
        for (i$ = 0, len$ = memo.length; i$ < len$; ++i$) {
          i = i$;
          m = memo[i$];
          x = 99 - i;
          h = 50 * abs(m) / (maxabs || 1);
          if (m < 0) {
            y = 50;
          } else {
            y = 50 - 50 * m / (maxabs || 1);
          }
          if (h === 0) {
            h = 1;
          }
          z2$ = ctx;
          z2$.fillRect(x, y, 1, h);
        }
        z3$ = ctx;
        z3$.fillStyle = '#fff';
        z3$.fillText(title + '  ' + it.toFixed(3).toString(), 0, 0);
        return z3$;
      }
    });
    return this;
  };
}).call(this);
