(function(){
  var Signal, DomInput, Keyboard, Mouse, __;
  import$(this, prelude);
  Signal = function(){
    var SignalClass;
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args), t;
      return (t = typeof result)  == "object" || t == "function" ? result || child : child;
  })(SignalClass = (function(){
      SignalClass.displayName = 'SignalClass';
      var prototype = SignalClass.prototype, constructor = SignalClass;
      function SignalClass(register){
        this.sampleOn = bind$(this, 'sampleOn', prototype);
        this.latch = bind$(this, 'latch', prototype);
        this.throttle = bind$(this, 'throttle', prototype);
        this.delay = bind$(this, 'delay', prototype);
        this.count = bind$(this, 'count', prototype);
        this.dropRepeats = bind$(this, 'dropRepeats', prototype);
        this.foldp = bind$(this, 'foldp', prototype);
        this.whenTrue = bind$(this, 'whenTrue', prototype);
        this.keepIf = bind$(this, 'keepIf', prototype);
        this.lift = bind$(this, 'lift', prototype);
        this['new'] = bind$(this, 'new', prototype);
        this.send = bind$(this, 'send', prototype);
        this.handlers = [];
        register(this.send);
      }
      prototype.send = function(value){
        var i$, ref$, len$, handler;
        this._value = value;
        for (i$ = 0, len$ = (ref$ = this.handlers).length; i$ < len$; ++i$) {
          handler = ref$[i$];
          handler(value);
        }
        return this._memo = value;
      };
      prototype['new'] = function(adder){
        var this$ = this;
        return Signal(function(send){
          return this$.handlers.push(adder(send));
        });
      };
      prototype.lift = function(fn){
        return this['new'](function(send){
          return function(value){
            return send(fn(value));
          };
        });
      };
      prototype.keepIf = function(test){
        return this['new'](function(send){
          var this$ = this;
          return function(value){
            if (test(value)) {
              return send(value);
            }
          };
        });
      };
      prototype.whenTrue = function(){
        return this.keepIf(function(it){
          return it;
        });
      };
      prototype.foldp = function(def, fn){
        var signal;
        return signal = this['new'](function(send){
          return function(value){
            var ref$;
            return send(fn(value, (ref$ = signal._memo) != null ? ref$ : def));
          };
        });
      };
      prototype.dropRepeats = function(def){
        var signal, this$ = this;
        return signal = this.keepIf(function(value){
          return signal._memo !== value;
        });
      };
      prototype.count = function(){
        return this.foldp(0, function(value, memo){
          return memo + 1;
        });
      };
      prototype.delay = function(ms){
        return this['new'](function(send){
          return function(value){
            return _.delay(function(){
              return send(value);
            }, ms);
          };
        });
      };
      prototype.throttle = function(ms){
        return this['new'](function(send){
          return _.throttle(function(value){
            return send(value);
          }, ms);
        });
      };
      prototype.latch = function(ms){
        var signal;
        signal = this['new'](function(send){
          var sendFalse;
          sendFalse = _.debounce(function(){
            return send(false);
          }, ms);
          return function(value){
            send(true);
            return sendFalse();
          };
        });
        return signal.dropRepeats();
      };
      prototype.sampleOn = function(signal){
        var this$ = this;
        return this['new'](function(send){
          signal.lift(function(){
            return send(this$._value);
          });
          return function(){};
        });
      };
      return SignalClass;
    }()), arguments, function(){});
  };
  DomInput = function(event, el){
    var this$ = this;
    el == null && (el = document);
    return Signal(function(send){
      return $(el).on(event, send);
    });
  };
  Keyboard = (function(){
    Keyboard.displayName = 'Keyboard';
    var prototype = Keyboard.prototype, constructor = Keyboard;
    Keyboard.isDown = function(keyCode){
      var updown;
      updown = Signal(function(send){
        var reg;
        reg = function(event){
          return DomInput(event).keepIf(function(event){
            return event.keyCode === keyCode;
          });
        };
        reg('keydown').lift(function(){
          return send(true);
        });
        return reg('keyup').lift(function(){
          return send(false);
        });
      });
      return updown.dropRepeats();
    };
    Keyboard.arrows = function(){};
    function Keyboard(){}
    return Keyboard;
  }());
  Mouse = (function(){
    Mouse.displayName = 'Mouse';
    var prototype = Mouse.prototype, constructor = Mouse;
    Mouse.position = Signal(function(send){
      var i$, ref$, len$, event, results$ = [];
      for (i$ = 0, len$ = (ref$ = ['mousemove', 'mousedown', 'mouseup']).length; i$ < len$; ++i$) {
        event = ref$[i$];
        results$.push(DomInput(event).lift(fn$));
      }
      return results$;
      function fn$(it){
        return send({
          x: it.clientX,
          y: it.clientY
        });
      }
    });
    Mouse.isDown = Signal(function(send){
      DomInput('mousedown').lift(function(){
        return send(true);
      });
      return DomInput('mouseup').lift(function(){
        return send(false);
      });
    });
    Mouse.isClicked = Signal(function(send){
      return DomInput('click').lift(function(){
        send(true);
        return send(false);
      });
    });
    Mouse.clicks = Mouse.isClicked.whenTrue();
    function Mouse(){}
    return Mouse;
  }());
  __ = function(it){
    console.log.apply(console, arguments);
    return it;
  };
  Mouse.position.sampleOn(Mouse.clicks).lift(function(it){
    return __('mouse position on click', it);
  });
  Mouse.position.latch(1000).lift(function(it){
    if (it === true) {
      return __('mouse is active');
    } else {
      return __('mouse is inactive: not moved in 1 sec');
    }
  });
  Keyboard.isDown(32).keepTrue().delay(500).count().lift(function(it){
    return __('space presses (delayed): ', it);
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
