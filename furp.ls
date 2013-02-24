import prelude
___ = -> console.log ...arguments; it
(window or module?exports).furp = API ||= {}

API.Signal = Signal = -> new SignalClass it
API.SignalClass = class SignalClass
  (setup) ->
    @_targets = []
    setup send = ~>
      @_state = it
      if it? => for handle in @_targets => handle ...arguments
      it

  new: (fun) ~>
    Signal (send) ~>
      new_send = (fun send)
      @_targets.push -> new_send it
      if @_state? then new_send @_state

  lift: (fun) ~>
    @new (send) -> -> send fun it

  keep-if: (test = -> it) ~>
    @lift -> if test it then it else undefined

  keep-when: (signal) ~>
    @keep-if -> signal._state

  feedback: (fun) ~>
    signal = @new (send) ->
      new_send = (fun send)
      -> | signal?_state? => new_send it, signal._state
         | _              => new_send it, void

  foldp: (def, fn) ~>
    @feedback (send) -> (it, old=def) ->
      send fn it, old

  drop-repeats: ~>
    @feedback (send) -> (it, old=void) ->
      if not (_.isEqual it, old) then send it

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
      new_send = _.throttle (-> send it), ms
      -> new_send it

  debounce: (ms) ~>
    @new (send) ->
      new_send = _.debounce (-> send it), ms
      -> new_send it

  latch: (ms) ~>
    signal = Signal (send) ~>
      send-no = _.debounce (-> send no), ms
      @lift -> send yes; send-no!
    signal.drop-repeats!

  sample-on: (signal, fn = -> it) ~>
    state = void
    @lift -> state := it
    Signal (send) ~>
      signal.lift ~> send fn state, it

  __: (key, title = '') -> # log helper
    @keep-when Keyboard.is-down key
      .lift -> ___ title, it.toString()
    this

API.Merge = Merge = (def, signals) ->
  Signal (send) ->
    for signal in signals
      signal.lift -> send it
    send def

API.Lift = Lift = (fn, signals) -->
  state = [void for s in signals]
  Signal (send) ->
    for signal, i in signals
      i |> (i) -> signal.lift -> state[i] = it; send fn ...state

Scan = ->

#

API.DomEvent = DomEvent = (event, el = document) ->
  Signal (send) ->
    $ el .on event, -> send it; true


API.Keyboard = class Keyboard
  @is-down = (key, el) ->
    keyCode = if _.isString key then key.charCodeAt 0 else key
    Merge no, o= for event, value in [\keydown \keyup]
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
    Keyboard.isDown keyCode, el
      .keep-if!

  @arrows = (el) ->
    keymap =      [[37 -1] [39 +1]  [40 -1] [38 +1]]
    lifter = Lift (left=0, right=0, down=0, up=0) ->
      [left + right, down + up]
    lifter o= for [keyCode, value] in keymap
      value |> (value) ->
        Keyboard.is-down keyCode*1
          .lift -> if it then value else 0


API.Mouse = class Mouse
  @position = (el) ->
    Merge [0, 0], o= for event in [\mousemove \mousedown \mouseup]
      (DomEvent event, el).lift -> [it.pageX, it.pageY] if it?
  @is-down = (el) ->
    Merge no, o= for event in [\mousedown \mouseup]
      DomEvent event, el .lift -> it?type is \mousedown
  @is-clicked = (el) ->
    Signal (send) ->
      (DomEvent \click, el).lift -> send yes; send no
  @clicks = (el) ->
    (Mouse.isClicked el).keep-if!


API.Time = class Time
  @frame = ->
    if not @_frame? => @_frame = Signal (send) ->
      fn = -> requestAnimationFrame (-> send it; fn!)
      fn!
    @_frame
  @delta = ->
