if (typeof window == 'undefined' || window === null) {
  require('prelude-ls').installPrelude(global);
} else {
  prelude.installPrelude(window);
}
(function(){
  var ___, API, Signal, SignalClass, Merge, Lift, Scan, DomEvent, Keyboard, Mouse, Time, slice$ = [].slice;
  import$(this, prelude);
  ___ = function(it){
    console.log.apply(console, arguments);
    return it;
  };
  (window || (typeof module != 'undefined' && module !== null ? module.exports : void 8)).furp = API || (API = {});
  API.Signal = Signal = function(it){
    return new SignalClass(it);
  };
  API.SignalClass = SignalClass = (function(){
    SignalClass.displayName = 'SignalClass';
    var prototype = SignalClass.prototype, constructor = SignalClass;
    function SignalClass(setup){
      var send, this$ = this;
      this.sampleOn = bind$(this, 'sampleOn', prototype);
      this.latch = bind$(this, 'latch', prototype);
      this.throttle = bind$(this, 'throttle', prototype);
      this.delay = bind$(this, 'delay', prototype);
      this.count = bind$(this, 'count', prototype);
      this.merge = bind$(this, 'merge', prototype);
      this.dropRepeats = bind$(this, 'dropRepeats', prototype);
      this.foldp = bind$(this, 'foldp', prototype);
      this.keepWhen = bind$(this, 'keepWhen', prototype);
      this.keepIf = bind$(this, 'keepIf', prototype);
      this.lift = bind$(this, 'lift', prototype);
      this._targets = [];
      setup(send = function(it){
        var i$, ref$, len$, handle;
        this$._state = it;
        if (it != null) {
          for (i$ = 0, len$ = (ref$ = this$._targets).length; i$ < len$; ++i$) {
            handle = ref$[i$];
            handle.apply(null, arguments);
          }
        }
        return it;
      });
    }
    prototype.lift = function(fn){
      var this$ = this;
      return Signal(function(send){
        this$._targets.push(function(it){
          return send(fn(it));
        });
        if (this$._state != null) {
          return send(fn(this$._state));
        }
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
      signal.lift(function(it){
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
    prototype.merge = function(){
      var signals;
      signals = slice$.call(arguments);
      return Merge(this._state, [this].concat(slice$.call(signals)));
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
    prototype.sampleOn = function(signal, fn){
      var state, this$ = this;
      fn == null && (fn = function(it){
        return it;
      });
      state = void 8;
      this.lift(function(it){
        return state = it;
      });
      return Signal(function(send){
        return signal.lift(function(it){
          return send(fn(state, it));
        });
      });
    };
    prototype.__ = function(key, title){
      title == null && (title = '');
      this.keepWhen(Keyboard.isDown(key)).lift(function(it){
        return ___(prefix, it.toString());
      });
      return this;
    };
    return SignalClass;
  }());
  API.Merge = Merge = function(def, signals){
    return Signal(function(send){
      var i$, ref$, len$, signal;
      for (i$ = 0, len$ = (ref$ = signals).length; i$ < len$; ++i$) {
        signal = ref$[i$];
        signal.lift(fn$);
      }
      return send(def);
      function fn$(it){
        return send(it);
      }
    });
  };
  API.Lift = Lift = curry$(function(fn, signals){
    var state, res$, i$, len$, s;
    res$ = [];
    for (i$ = 0, len$ = signals.length; i$ < len$; ++i$) {
      s = signals[i$];
      res$.push(void 8);
    }
    state = res$;
    return Signal(function(send){
      var i$, ref$, len$, i, signal, results$ = [];
      for (i$ = 0, len$ = (ref$ = signals).length; i$ < len$; ++i$) {
        i = i$;
        signal = ref$[i$];
        results$.push(fn$(
        i));
      }
      return results$;
      function fn$(i){
        return signal.lift(function(it){
          state[i] = it;
          return send(fn.apply(null, state));
        });
      }
    });
  });
  Scan = function(){};
  API.DomEvent = DomEvent = function(event, el){
    el == null && (el = document);
    return Signal(function(send){
      return $(el).on(event, function(it){
        send(it);
        return true;
      });
    });
  };
  API.Keyboard = Keyboard = (function(){
    Keyboard.displayName = 'Keyboard';
    var prototype = Keyboard.prototype, constructor = Keyboard;
    Keyboard.isDown = function(key, el){
      var keyCode, o, value, event;
      keyCode = _.isString(key) ? key.charCodeAt(0) : key;
      return Merge(false, o = (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = ['keydown', 'keyup']).length; i$ < len$; ++i$) {
          value = i$;
          event = ref$[i$];
          results$.push(DomEvent(event, el).keepIf(fn$).lift(fn1$));
        }
        return results$;
        function fn$(it){
          return (it != null ? it.keyCode : void 8) === keyCode;
        }
        function fn1$(it){
          return (it != null ? it.type : void 8) === 'keydown';
        }
      }())).dropRepeats();
    };
    Keyboard.isPressed = function(keyCode, el){
      return Signal(function(send){
        return Keyboard.isDown(keyCode, el).keepIf().lift(function(){
          send(true);
          return send(false);
        });
      });
    };
    Keyboard.presses = function(keyCode, el){
      return Keyboard.isDown(keyCode, el).keepIf();
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
  API.Mouse = Mouse = (function(){
    Mouse.displayName = 'Mouse';
    var prototype = Mouse.prototype, constructor = Mouse;
    Mouse.position = function(el){
      var o, event;
      return Merge([0, 0], o = (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = ['mousemove', 'mousedown', 'mouseup']).length; i$ < len$; ++i$) {
          event = ref$[i$];
          results$.push(DomEvent(event, el).lift(fn$));
        }
        return results$;
        function fn$(it){
          if (it != null) {
            return [it.pageX, it.pageY];
          }
        }
      }()));
    };
    Mouse.isDown = function(el){
      var o, event;
      return Merge(false, o = (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = ['mousedown', 'mouseup']).length; i$ < len$; ++i$) {
          event = ref$[i$];
          results$.push(DomEvent(event, el).lift(fn$));
        }
        return results$;
        function fn$(it){
          return (it != null ? it.type : void 8) === 'mousedown';
        }
      }()));
    };
    Mouse.isClicked = function(el){
      return Signal(function(send){
        return DomEvent('click', el).lift(function(){
          send(true);
          return send(false);
        });
      });
    };
    Mouse.clicks = function(el){
      return Mouse.isClicked(el).keepIf();
    };
    function Mouse(){}
    return Mouse;
  }());
  API.Time = Time = (function(){
    Time.displayName = 'Time';
    var prototype = Time.prototype, constructor = Time;
    Time.frame = function(){
      if (this._frame == null) {
        this._frame = Signal(function(send){
          var fn;
          fn = function(){
            return requestAnimationFrame(function(it){
              send(it);
              return fn();
            });
          };
          return fn();
        });
      }
      return this._frame;
    };
    Time.delta = function(){};
    function Time(){}
    return Time;
  }());
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
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
