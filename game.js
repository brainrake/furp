(function(){
  var __, ACCEL, PLAYER_SIZE, GRAVITY, MAP, INITIAL_SPEED, INITIAL_POSITION, vadd, vsub, vlen, vdot, vangle, vnorm, draw, collide, collideBlocks, time, controls, acceleration, velocity, position, collision, x$;
  import$(this, furp);
  __ = function(it){
    console.log.apply(console, arguments);
    return it;
  };
  ACCEL = 0.01;
  PLAYER_SIZE = [0.4, 0.6];
  GRAVITY = [0, -0.005];
  MAP = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 1, 1], [1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0, 0, 0]];
  INITIAL_SPEED = [0, 0];
  INITIAL_POSITION = [0, 7];
  vadd = zipWith(curry$(function(x$, y$){
    return x$ + y$;
  }));
  vsub = zipWith(curry$(function(x$, y$){
    return x$ - y$;
  }));
  vlen = function(v){
    return sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
  };
  vdot = function(a, b){
    return fold(curry$(function(x$, y$){
      return x$ + y$;
    }), 0, zipWith(curry$(function(x$, y$){
      return x$ * y$;
    }), a, b));
  };
  vangle = function(a, b){
    return vdot(a, b) / (vlen(a) * vlen(b));
  };
  vnorm = function(v){
    return [v[0] / vlen(v), v[1] / vlen(v)];
  };
  draw = function(el, arg$, arg1$){
    var x, y, ref$, sx, sy;
    x = arg$[0], y = arg$[1];
    ref$ = arg1$ != null
      ? arg1$
      : [1, 1], sx = ref$[0], sy = ref$[1];
    return $(el).css({
      left: x * 50,
      top: 400 - sy * 50 - y * 50
    });
  };
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
        return (8 - size) - p - v;
      case !(v + p <= 0):
        return (0 - p) - v;
      default:
        return 0;
      }
    };
    return zipAllWith(testWall, vel, pos, PLAYER_SIZE);
  };
  collideBlocks = function(old_vel, cvel, pos){
    var vel, testBlock, blocks, i$, x, j$, y, len$, block;
    vel = cvel;
    testBlock = function(block, size){
      var testOverlap, overlap;
      testOverlap = function(b, p, s){
        var ref$;
        switch (false) {
        case !(b + 0.5 - s / 2 < p && p < b + 1):
          return p - (b + 1);
        case !(b + 0.5 + s / 2 > (ref$ = p + s) && ref$ > b):
          return p + s - b;
        default:
          return 0;
        }
      };
      overlap = zipAllWith(testOverlap, block, vadd(vel, pos), size);
      if (overlap[0] !== 0 && overlap[1] !== 0) {
        if (abs(vnorm(overlap)[1]) < abs(vnorm(vel)[1])) {
          overlap[0] = 0;
        } else {
          overlap[1] = 0;
        }
        return vsub(vel, overlap);
      } else {
        return vel;
      }
    };
    blocks = [];
    for (i$ = 0; i$ < 8; ++i$) {
      x = i$;
      for (j$ = 0; j$ < 8; ++j$) {
        y = j$;
        if (MAP[7 - y][x]) {
          blocks.push([x, y]);
        }
      }
    }
    for (i$ = 0, len$ = blocks.length; i$ < len$; ++i$) {
      block = blocks[i$];
      vel = testBlock(block, PLAYER_SIZE);
    }
    return vsub(vel, cvel);
  };
  time = Time.frame();
  controls = Keyboard.arrows().lift(function(arg$){
    var x, y;
    x = arg$[0], y = arg$[1];
    return [x, y >= 0 ? y : 0];
  });
  acceleration = controls.sampleOn(time).lift(map((function(it){
    return it * ACCEL;
  }))).lift(function(it){
    return vadd(it, GRAVITY);
  });
  velocity = acceleration.foldp(function(acc, old_vel){
    var bvel, cvel, vvel;
    old_vel == null && (old_vel = INITIAL_SPEED);
    bvel = vadd(old_vel, acc);
    cvel = vadd(bvel, collide(bvel, (typeof position != 'undefined' && position !== null ? position._state : void 8) || INITIAL_POSITION));
    return vvel = vadd(cvel, collideBlocks(old_vel, cvel, (typeof position != 'undefined' && position !== null ? position._state : void 8) || INITIAL_POSITION));
  });
  position = velocity.foldp(function(vel, pos){
    pos == null && (pos = INITIAL_POSITION);
    return vadd(vel, pos);
  });
  collision = Lift(function(pos, vel){});
  position.lift(function(it){
    return draw('.player', it, PLAYER_SIZE);
  });
  position.___('position').__('P', 'position');
  x$ = velocity;
  x$.___('velocity');
  x$.__('V', 'velocity');
  x$.lift(function(it){
    return it[1];
  }).___('velocity-y');
  x$.lift(function(it){
    return it[0];
  }).___('velocity-x');
  acceleration.__('A', 'accel').___('accel');
  controls.__('C', 'controls').___('controls');
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
}).call(this);
