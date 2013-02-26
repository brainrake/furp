(function(){
  var __, getctx, inner, genOp, generalize_operator, Tensor, ref$, BLOCKSIZE, ACCEL, PLAYER_SIZE, GRAVITY, MAP, INITIAL_SPEED, INITIAL_POSITION, box, draw, collide, collideBlocks, controls, acceleration, velocity, position, player;
  import$(this, furp);
  __ = function(it){
    console.log.apply(console, arguments);
    return it;
  };
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
        for (i$ = 0; i$ < 64; ++i$) {
          i = i$;
          if (memo[i] == null) {
            continue;
          }
          ctx.strokeStyle = '#2' + (16 - Math.round(i / 4)).toString(16) + '2';
          if (i === 0) {
            ctx.strokeStyle = '#fff';
          }
          y$ = ctx;
          y$.beginPath();
          y$.moveTo(50.5, 50.5);
          y$.lineTo(50.5 + memo[i][0] / (maxabs || 1) * 100, 50.5 - memo[i][1] / (maxabs || 1) * 100);
          y$.stroke();
        }
        z$ = ctx;
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
  inner = curry$(function(f, g, u, v){
    return reduce(g, zipWith(f, u, v));
  });
  genOp = generalize_operator = function(name, fn){
    var op;
    return op = function(other){
      var i$, len$, i, v, this$ = this;
      if (other.length != null) {
        zipWith;
      }
      for (i$ = 0, len$ = this.length; i$ < len$; ++i$) {
        i = i$;
        v = this[i$];
        if (other[i].length != null) {
          zipWith(it[name]);
        }
      }
      return zipWith(function(it){
        if (it.length != null) {
          return it[name](this$);
        } else {
          return fn;
        }
      });
    };
  };
  Tensor = (function(superclass){
    var prototype = extend$((import$(Tensor, superclass).displayName = 'Tensor', Tensor), superclass).prototype, constructor = Tensor;
    prototype['+'] = genOp('+', curry$(function(x$, y$){
      return x$ + y$;
    }));
    prototype['-'] = genOp('-', curry$(function(x$, y$){
      return x$ - y$;
    }));
    prototype['/'] = genOp('/', curry$(function(x$, y$){
      return x$ / y$;
    }));
    prototype['*'] = genOp('*', curry$(function(x$, y$){
      return x$ * y$;
    }));
    prototype['.'] = function(it){
      return inner(curry$(function(x$, y$){
        return x$ + y$;
      }), curry$(function(x$, y$){
        return x$ * y$;
      }), this, it);
    };
    function Tensor(){
      Tensor.superclass.apply(this, arguments);
    }
    return Tensor;
  }(Array));
  ref$ = Array.prototype;
  ref$['+'] = function(it){
    return zipWith(curry$(function(x$, y$){
      return x$ + y$;
    }), this, it);
  };
  ref$['-'] = function(it){
    return zipWith(curry$(function(x$, y$){
      return x$ - y$;
    }), this, it);
  };
  ref$['/'] = function(it){
    return zipWith(curry$(function(x$, y$){
      return x$ / y$;
    }), this, it);
  };
  ref$['*'] = function(it){
    return zipWith(curry$(function(x$, y$){
      return x$ * y$;
    }), this, it);
  };
  ref$['.'] = function(it){
    return inner(curry$(function(x$, y$){
      return x$ + y$;
    }), curry$(function(x$, y$){
      return x$ * y$;
    }), this, it);
  };
  BLOCKSIZE = 50;
  ACCEL = 0.01;
  PLAYER_SIZE = [0.4, 1];
  GRAVITY = [0, -0.005];
  MAP = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 1, 1], [1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 1, 0, 1, 0], [0, 0, 1, 1, 1, 0, 0, 0]];
  INITIAL_SPEED = [0, 0];
  INITIAL_POSITION = [0, 7];
  box = function(x, y){};
  draw = curry$(function(el, pos){
    var ref$, x, y;
    ref$ = map((function(it){
      return it * BLOCKSIZE;
    }), pos), x = ref$[0], y = ref$[1];
    return $(el).css({
      left: x,
      top: 350 - y
    });
  });
  $(function(){
    var i$, x, lresult$, j$, y, el, results$ = [];
    for (i$ = 0; i$ < 8; ++i$) {
      x = i$;
      lresult$ = [];
      for (j$ = 0; j$ < 8; ++j$) {
        y = j$;
        if (MAP[7 - y][x]) {
          $('.ct').append(el = $("<div class='box'></div>"));
          lresult$.push(draw(el, [x, y]));
        }
      }
      results$.push(lresult$);
    }
    return results$;
  });
  collide = function(vel, pos){
    var testWall;
    testWall = function(v, p, size){
      switch (false) {
      case !(v + p >= 8 - size):
        return (8 - size) - p;
      case !(v + p <= 0):
        return -p;
      default:
        return v;
      }
    };
    return zipAllWith(testWall, vel, pos, PLAYER_SIZE);
  };
  collideBlocks = function(vel, pos){
    var testBlock, blocks, i$, x, j$, y, len$, block;
    testBlock = function(block, v, p){
      return v['+p'];
    };
    blocks = [];
    for (i$ = 0; i$ < 8; ++i$) {
      x = i$;
      for (j$ = 0; j$ < 8; ++j$) {
        y = j$;
        if (MAP[y][y]) {
          blocks.push([x, y]);
        }
      }
    }
    for (i$ = 0, len$ = blocks.length; i$ < len$; ++i$) {
      block = blocks[i$];
      zipAllWith(testBlock, block, vel, pos);
    }
    return vel;
  };
  controls = Keyboard.arrows().lift(function(arg$){
    var x, y;
    x = arg$[0], y = arg$[1];
    return [x, y >= 0 ? y : 0];
  });
  acceleration = controls.lift(map((function(it){
    return it * ACCEL;
  }))).lift(function(it){
    return it['+'](GRAVITY);
  }).__('A', 'accel');
  acceleration.lift(function(it){
    return it[1];
  }).___('accel-y');
  velocity = acceleration.sampleOn(Time.frame()).foldp(function(acc, old_vel){
    var vel, cvel;
    old_vel == null && (old_vel = INITIAL_SPEED);
    vel = acc['+'](old_vel);
    return cvel = collide(vel, (typeof position != 'undefined' && position !== null ? position._state : void 8) || INITIAL_POSITION);
  }).__('V', 'velocity').___('velocity');
  velocity.lift(function(it){
    return it[1];
  }).___('velocity-y');
  position = velocity.foldp(function(vel, pos){
    pos == null && (pos = INITIAL_POSITION);
    return vel['+'](pos);
  }).__('P', 'position');
  player = position.lift(draw('.player'));
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);
