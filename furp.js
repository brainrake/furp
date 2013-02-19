if (typeof window == 'undefined' || window === null) {
  require('prelude-ls').installPrelude(global);
} else {
  prelude.installPrelude(window);
}
(function(){
  var ___, API, Signal, Merge, Lift, Scan, DomEvent, Keyboard, Mouse, Frame, __;
  ___ = function(it){
    console.log.apply(console, arguments);
    return it;
  };
  (window || (typeof module != 'undefined' && module !== null ? module.exports : void 8)).furp = API = {};
  Signal = function(it){
    var SignalClass;
    return new (SignalClass = (function(){
      SignalClass.displayName = 'SignalClass';
      var prototype = SignalClass.prototype, constructor = SignalClass;
      function SignalClass(register){
        var memo, send, this$ = this;
        this.sampleOn = bind$(this, 'sampleOn', prototype);
        this.latch = bind$(this, 'latch', prototype);
        this.throttle = bind$(this, 'throttle', prototype);
        this.delay = bind$(this, 'delay', prototype);
        this.count = bind$(this, 'count', prototype);
        this.dropRepeats = bind$(this, 'dropRepeats', prototype);
        this.foldp = bind$(this, 'foldp', prototype);
        this.keepWhen = bind$(this, 'keepWhen', prototype);
        this.keepIf = bind$(this, 'keepIf', prototype);
        this.lift = bind$(this, 'lift', prototype);
        this._targets = [];
        memo = void 8;
        register(send = function(value){
          var i$, ref$, len$, handle;
          for (i$ = 0, len$ = (ref$ = this$._targets).length; i$ < len$; ++i$) {
            handle = ref$[i$];
            handle(value, memo);
          }
          return memo = value;
        });
      }
      prototype.lift = function(fn){
        var this$ = this;
        return Signal(function(send){
          return this$._targets.push(function(value, memo){
            return send(fn(value, memo));
          });
        });
      };
      prototype.keepIf = function(test){
        var this$ = this;
        test == null && (test = function(it){
          return it;
        });
        return Signal(function(send){
          return this$.lift(function(it){
            return test(it) && send(it);
          });
        });
      };
      prototype.keepWhen = function(signal){
        var memo;
        memo = void 8;
        this.lift(function(it){
          return memo = it;
        });
        return this.keepIf(function(){
          return memo;
        });
      };
      prototype.foldp = function(def, fn){
        var memo, this$ = this;
        memo = def;
        return Signal(function(send){
          return this$.lift(function(value){
            memo = fn(value, memo);
            return send(memo);
          });
        });
      };
      prototype.dropRepeats = function(){
        var memo, this$ = this;
        memo = void 8;
        return Signal(function(send){
          return this$.lift(function(it){
            if (!_.isEqual(it, memo)) {
              send(it);
            }
            return memo = it;
          });
        });
      };
      prototype.count = function(){
        return this.foldp(0, function(value, memo){
          return memo + 1;
        });
      };
      prototype.delay = function(ms){
        var this$ = this;
        return Signal(function(send){
          return this$.lift(function(value){
            return _.delay(function(){
              return send(value);
            }, ms);
          });
        });
      };
      prototype.throttle = function(ms){
        var this$ = this;
        return Signal(function(send){
          return this$.lift(_.throttle(function(it){
            return send(it);
          }, ms));
        });
      };
      prototype.latch = function(ms){
        var signal, this$ = this;
        signal = Signal(function(send){
          var sendNo;
          sendNo = _.debounce(function(){
            return send(false);
          }, ms);
          return this$.lift(function(){
            send(true);
            return sendNo();
          });
        });
        return signal.dropRepeats();
      };
      prototype.sampleOn = function(signal){
        var state, this$ = this;
        state = void 8;
        this.lift(function(it){
          return state = it;
        });
        return Signal(function(send){
          return signal.lift(function(){
            return send(state);
          });
        });
      };
      return SignalClass;
    }()))(it);
  };
  Merge = function(signals){
    return Signal(function(send){
      var i$, ref$, len$, signal, results$ = [];
      for (i$ = 0, len$ = (ref$ = signals).length; i$ < len$; ++i$) {
        signal = ref$[i$];
        results$.push(signal.lift(fn$));
      }
      return results$;
      function fn$(it){
        return send(it);
      }
    });
  };
  Lift = curry$(function(fn, signals){
    return Signal(function(send){
      var state, i, signal;
      return state = (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = signals).length; i$ < len$; ++i$) {
          i = i$;
          signal = ref$[i$];
          fn$(
          i);
          results$.push(void 8);
        }
        return results$;
        function fn$(i){
          return signal.lift(function(it){
            state[i] = it;
            return send(fn.apply(null, state));
          });
        }
      }());
    });
  });
  Scan = function(){};
  DomEvent = function(event, el){
    el == null && (el = document);
    return Signal(function(send){
      return $(el).on(event, function(it){
        send(it);
        return true;
      });
    });
  };
  Keyboard = (function(){
    Keyboard.displayName = 'Keyboard';
    var prototype = Keyboard.prototype, constructor = Keyboard;
    Keyboard.isDown = function(keyCode, el){
      var o, event, value;
      return Merge(o = (function(){
        var ref$, results$ = [];
        for (event in ref$ = {
          keydown: true,
          keyup: false
        }) {
          value = ref$[event];
          results$.push(DomEvent(event, el).keepIf(fn$).lift(fn1$));
        }
        return results$;
        function fn$(it){
          return it.keyCode === keyCode;
        }
        function fn1$(it){
          return it.type === 'keydown';
        }
      }())).dropRepeats();
    };
    Keyboard.arrows = function(el){
      var keymap, lifter, o, keyCode, value;
      keymap = [[37, -1], [39, +1], [40, -1], [38, +1]];
      lifter = Lift(function(left, right, down, up){
        left == null && (left = 0);
        right == null && (right = 0);
        down == null && (down = 0);
        up == null && (up = 0);
        return [left + right, down + up];
      });
      return lifter(o = (function(){
        var i$, ref$, len$, ref1$, results$ = [];
        for (i$ = 0, len$ = (ref$ = keymap).length; i$ < len$; ++i$) {
          ref1$ = ref$[i$], keyCode = ref1$[0], value = ref1$[1];
          results$.push(fn$(
          value));
        }
        return results$;
        function fn$(value){
          return Keyboard.isDown(keyCode * 1).lift(function(it){
            if (it) {
              return value;
            } else {
              return 0;
            }
          });
        }
      }()));
    };
    function Keyboard(){}
    return Keyboard;
  }());
  Mouse = (function(){
    Mouse.displayName = 'Mouse';
    var event, value, prototype = Mouse.prototype, constructor = Mouse;
    Mouse.position = Merge((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = ['mousemove', 'mousedown', 'mouseup']).length; i$ < len$; ++i$) {
        event = ref$[i$];
        results$.push(DomEvent(event).lift(fn$));
      }
      return results$;
      function fn$(it){
        return [it.clientX, it.clientY];
      }
    }()));
    Mouse.isDown = Merge((function(){
      var ref$, results$ = [];
      for (event in ref$ = {
        mousedown: true,
        mouseup: false
      }) {
        value = ref$[event];
        results$.push(DomEvent(event).lift(fn$));
      }
      return results$;
      function fn$(){
        return value;
      }
    }()));
    Mouse.isClicked = Signal(function(send){
      return DomEvent('click').lift(function(){
        send(true);
        return send(false);
      });
    });
    Mouse.clicks = Mouse.isClicked.keepIf();
    function Mouse(){}
    return Mouse;
  }());
  Frame = Signal(function(send){
    return requestAnimationFrame(function(it){
      return send(it);
    });
  });
  __ = function(it){
    console.log.apply(console, arguments);
    return it;
  };
  Mouse.position.sampleOn(Mouse.clicks).lift(function(it){
    return __('mouse position on click', it);
  });
  Mouse.position.latch(1000).lift(function(it){
    switch (false) {
    case !it:
      return __('mouse active', it);
    default:
      return __('mouse inactive: not moved in 1 sec', it);
    }
  });
  Keyboard.isDown(32).keepIf().delay(500).count().lift(function(it){
    return __('space presses (delayed by 500ms): ', it);
  });
  Keyboard.arrows().lift(function(it){
    return ___('arrows', it);
  });
  Keyboard.arrows().foldp([0, 0], function(value, memo){
    return zipWith(curry$(function(x$, y$){
      return x$ + y$;
    }), value, memo);
  }).dropRepeats().lift(function(it){
    return __('pos', it);
  });
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
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
