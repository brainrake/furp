(function(){
  var inner, genOp, generalize_operator, Tensor, ref$;
  inner = curry$(function(f, g, u, v){
    return reduce(g, zipWith(f, u, v));
  });
  genOp = generalize_operator = function(name, fn){
    var op;
    return op = function(other){
      var i$, len$, i, v, results$ = [];
      if (other.length != null) {
        zipWith;
      }
      for (i$ = 0, len$ = this.length; i$ < len$; ++i$) {
        i = i$;
        v = this[i$];
        if (other[i].length != null) {
          results$.push(zipWith(it[name]));
        }
      }
      return results$;
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
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
