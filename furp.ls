import prelude

Signal = -> new (class SignalClass
  (register) ->
    @handlers = []
    register @send

  send: (value) ~>
    @_value = value
    for handler in @handlers => handler value
    @_memo = value

  new: (adder) ~>
    Signal (send) ~>
      @handlers.push adder send

  lift: (fn) ~>
    @new (send) -> (value) ->
      send fn value

  keep-if: (test) ~>
    @new (send) -> (value) ~>
      if test value then send value

  when-true: ~> @keep-if -> it

  foldp: (def, fn) ~>
    signal = @new (send) -> (value) ->
      send (fn value, signal._memo ? def)

  drop-repeats: (def) ~>
    signal = @keep-if (value) ~>
      signal._memo != value

  count: ~>
    @foldp 0, (value, memo) ->
      memo + 1

  delay: (ms) ~>
    @new (send) -> (value) ->
      _.delay (-> send value), ms

  throttle: (ms) ~>
    @new (send) ->
      _.throttle ((value) -> send value), ms

  latch: (ms) ~>
    signal = @new (send) ->
      send-false = _.debounce (-> send false), ms
      (value) -> send true; send-false()
    signal.drop-repeats()

  sample-on: (signal) ~>
    @new (send) ~>
      signal.lift ~> send @_value
      ->
)(...arguments) # use Signal constructor without 'new'


DomInput = (event, el = document) ->
  Signal (send) ~> $ el .on event, send


class Keyboard
  @isDown = (keyCode) ->
    updown = Signal (send) ->
      reg = (event) -> DomInput event .keep-if (event) ->
        event.keyCode == keyCode
      reg \keydown .lift -> send true
      reg \keyup   .lift -> send false
    updown.drop-repeats()

  @arrows = ->


class Mouse
  @position =
    Signal (send) ->
      for event in <[ mousemove mousedown mouseup ]>
        DomInput event
          .lift -> send x: it.clientX, y: it.clientY
  @isDown =
    Signal (send) ->
      DomInput \mousedown .lift -> send true
      DomInput \mouseup   .lift -> send false
  @isClicked =
    Signal (send) ->
      DomInput \click .lift -> send true; send false
  @clicks =
    Mouse.isClicked.when-true()


# examples

__ = -> console.log ...arguments;  it

Mouse.position
  .sample-on Mouse.clicks
  .lift -> __ 'mouse position on click', it

Mouse.position
  .latch 1000
  .lift ->
    if it is true => __ 'mouse is active'
    else __ 'mouse is inactive: not moved in 1 sec'

Keyboard.isDown 32
  .keep-true()
  .delay 500
  .count()
  .lift -> __ 'space presses (delayed): ', it

