#import prelude
___ = -> console.log ...arguments; it
(window or module?exports).furp = API = {}


Signal = -> new (class SignalClass
  (register) ->
    @_targets = []
    memo = void
    register send = (value) ~>
      for handle in @_targets => handle value, memo
      memo := value

  lift: (fn) ~>
    Signal (send) ~>
      @_targets.push (value, memo) -> send fn value, memo

  keep-if: (test = -> it) ~>
    Signal (send) ~>
      @lift -> test it and send it

  keep-when: (signal) ~>
    memo = void
    @lift -> memo := it
    @keep-if -> memo

  foldp: (def, fn) ~>
    memo = def
    Signal (send) ~>
      @lift (value) ~>
        memo := fn value, memo
        send memo

  drop-repeats: ~>
    memo = void
    Signal (send) ~>
      @lift ->
        if not (_.isEqual it, memo) then send it
        memo := it

  count: ~>
    @foldp 0, (value, memo) ->
      memo + 1

  delay: (ms) ~>
    Signal (send) ~>
      @lift (value) -> _.delay (-> send value), ms

  throttle: (ms) ~>
    Signal (send) ~>
      @lift _.throttle (-> send it), ms

  latch: (ms) ~>
    signal = Signal (send) ~>
      send-no = _.debounce (-> send no), ms
      @lift -> send yes; send-no!
    signal.drop-repeats!

  sample-on: (signal) ~>
    state = void
    @lift -> state := it
    Signal (send) ~>
      signal.lift ~> send state
) it

Merge = (signals) ->
  Signal (send) ->
    for signal in signals
      signal.lift -> send it

Lift = (fn, signals) -->
  Signal (send) ->
    state = for signal, i in signals
      i |> (i) -> signal.lift -> state[i] = it; send fn ...state
      void

Scan = ->

#

DomEvent = (event, el = document) ->
  Signal (send) ->
    $ el .on event, -> send it; true


class Keyboard
  @is-down = (keyCode, el) ->
    Merge o= for event, value of {keydown: yes, keyup:no}
      DomEvent event, el
        .keep-if -> it.keyCode == keyCode
        .lift -> it.type == \keydown
    .drop-repeats!

  @arrows = (el) ->
    keymap = [[37 -1] [39 +1] [40 -1] [38 +1]]
    lifter = Lift (left=0, right=0, down=0, up=0) ->
      [left + right, down + up]
    lifter o= for [keyCode, value] in keymap
      value |> (value) ->
        Keyboard.is-down keyCode*1
          .lift -> if it then value else 0


class Mouse
  @position =
    Merge <| for event in [\mousemove \mousedown \mouseup]
      DomEvent event .lift -> [it.clientX, it.clientY]
  @is-down =
    Merge <| for event, value of {mousedown: yes, mouseup: no}
      DomEvent event .lift -> value
  @is-clicked =
    Signal (send) ->
      DomEvent \click .lift -> send yes; send no
  @clicks =
    Mouse.isClicked.keep-if!


Frame = Signal (send) ->
  requestAnimationFrame -> send it

# examples


__ = -> console.log ...arguments;  it

Mouse.position
  .sample-on Mouse.clicks
  .lift -> __ 'mouse position on click', it

Mouse.position
  .latch 1000
  .lift -> | it => __ 'mouse active', it
           | _  => __ 'mouse inactive: not moved in 1 sec', it

Keyboard.is-down 32
  .keep-if!
  .delay 500
  .count!
  .lift -> __ 'space presses (delayed by 500ms): ', it

Keyboard.arrows!
  .lift -> ___ 'arrows', it

Keyboard.arrows!
  .foldp [0, 0], (value, memo) ->
    zipWith (+), value, memo
  .drop-repeats!
  .lift -> __ 'pos', it
