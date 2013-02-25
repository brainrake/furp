import prelude
___ = -> console.log ...arguments; it
(window or module?exports).furp = API ||= {}

Signal = -> new SignalClass it
API.SignalClass = class SignalClass
  (setup) ->
    @_targets = []
    setup send = ~>
      @_state = it
      if it? => for handle in @_targets => handle ...arguments
      it

  new: (fun) ~>
    Signal (send) ~>
      new_send = fun send
      @_targets.push new_send
      if @_state? then new_send @_state

  lift: (fun) ~>
    @new (send) -> -> send fun it

  keep-if: (test = -> it) ~>
    @lift -> it if test it

  keep-when: (signal) ~>
    @keep-if -> signal?_state

  feedback: (fun) ~>
    signal = @new (send) ->
      new_send = fun send
      -> new_send it, signal?_state

  control: (signal_fun, fun) ~>
    @feedback (send) -> (it, old) ->
      other = signal_fun!?_state
      send fun it, other

  foldp: (fun) ~>
    @feedback (send) -> (it, old) ->
      send fun it, old
    #signal = @control (-> signal), (it, old) -> fun it, old

  drop-repeats: ~>
    @foldp (it, old) -> if not _.isEqual it, old then it else void

  merge: (...signals) ~>
    Merge @_state, [this, ...signals]

  count: ~>
    @feedback (send) ->
      send 0
      (it, old=0) -> send old + 1

  delay: (ms) ~>
    @new (send) -> (value) ->
      _.delay (-> send value), ms

  throttle: (ms) ~>
    @new (send) ->
      _.throttle (-> send it), ms

  debounce: (ms) ~>
    @new (send) ->
      _.debounce (-> send it), ms

  latch: (ms) ~>  # TODO
    Signal (send) ~>
      send-no = _.debounce (-> send no), ms
      @lift -> send yes; send-no!
    .drop-repeats!

  sample-on: (signal, fn = -> it) ~>
    Signal (send) ~>
      signal.lift ~> send fn @_state, it

API.Merge = Merge = (signals) ->
  Signal (send) ->
    for signal in signals
      signal.lift -> send it

API.Lift = Lift = (fn, signals) -->
  state = [void for s in signals]
  Signal (send) ->
    for signal, i in signals
      i |> (i) -> signal.lift -> state[i] = it; send fn ...state

API.Const = Const = (value) ->
  Signal (send) -> send value

#API.Scan = Scan = ->

#
# DOM stuff
#

API.DomEvent = DomEvent = (event, el = document) ->
  Signal (send) ->
    $ el .on event, -> send it; true


API.Keyboard = class Keyboard
  @is-down = (key, el) ->
    keyCode = if _.isString key then key.charCodeAt 0 else key
    Const off .merge o= for event in [\keydown \keyup]
      DomEvent event, el
        .keep-if -> it?keyCode == keyCode
        .lift -> it?type == \keydown
    .drop-repeats!

  @is-pressed = (keyCode, el) ->
    Signal (send) ->
      Keyboard.isDown keyCode, el
        .keep-if!
        .lift -> send yes; send no

  @presses = (keyCode, el) ->
    Keyboard.isDown keyCode, el .keep-if!

  @arrows = (el) ->
    keymap =      [[37 -1] [39 +1]  [40 -1] [38 +1]]
    lifter = Lift (left=0, right=0, down=0, up=0) ->
      [left + right, down + up]
    lifter o= for [keyCode, value] in keymap
      value |> (value) ->
        Keyboard.is-down keyCode*1
          .lift -> if it then value else 0

API.SignalClass.prototype.__ = (key, title = '') -> # log helper
  @keep-when -> Keyboard.is-down key
    .lift -> ___ title, it.toString()
  this


API.Mouse = class Mouse
  @position = (el) ->
    Const [0 0] .merge o= for event in [\mousemove \mousedown \mouseup]
      DomEvent event, el .lift -> [it.pageX, it.pageY] if it?
  @is-down = (el) ->
    Const no .merge o= for event in [\mousedown \mouseup]
      DomEvent event, el .lift -> it?type is \mousedown
  @is-clicked = (el) ->
    DomEvent \click, el .new (send) -> -> send yes; send no
  @clicks = (el) ->
    Mouse.isClicked el .keep-if!


API.Time = class Time
  @frame = ->
    @_frame ? Signal (send) ->
      do fn = -> requestAnimationFrame (-> fn!; send it)
    @_frame
  @delta = ->
    #@frame!feedback (send) -> (it, old) -> send it
