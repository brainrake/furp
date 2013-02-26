import furp
__ = -> console.log ...arguments;  it


getctx = (size) ->
  if not $ '#__signals' .0 then $ \body .append "<div id='__signals' style='position:fixed;height:100%;width:100%;'></div>"
  $ '#__signals' .append el = $ "<canvas height='#{size}' width='#{size}' style='float:right;top:0;left:0;height:#{size}px;width:#{size}px;'>"
  ctx = el[0].getContext '2d'


furp.SignalClass.prototype.___= (title = '', size=100) -> # log helper
  ctx = getctx size
  memo = []
  @lift ->
    memo.splice 0, 0, it
    if memo.length == 101
      memo := memo.slice 0,100
    #scale =
    ctx
      ..fillStyle = \#000
      ..fillRect 0,0, 100, 100
      ..font = '9px sans-serif'
      ..textBaseline = 'top'

    #__ it[1]*200

    if _.isArray it
      range = [[0 0] [0 0]]
      for m in memo => switch
        | m.0 < range.0.0 => range.0.0 = m.0
        | m.0 > range.1.0 => range.1.0 = m.0
        | m.1 < range.0.1 => range.0.1 = m.1
        | m.1 > range.1.1 => range.1.1 = m.1
      #__ range
      #range = [[(minimum map (.0) memo), (minimum map (.1) memo)],
      #         [(maximum map (.0) memo), (maximum map (.1) memo)]]

      maxabs = maximum map abs, _.flatten range
      for i from 0 til 64
        if not memo[i]? then continue
        #__ memo[i]
        ctx.strokeStyle = '#2'+ (16-(Math.round i/4)).toString(16) + '2'
        if i == 0
          ctx.strokeStyle = '#fff'
        ctx
          #..lineWidth = 2
          ..beginPath!
          ..moveTo 50.5, 50.5
          ..lineTo 50.5 + memo[i][0] / (maxabs or 1)*100, 50.5 - memo[i][1]/(maxabs or 1)* 100
          ..stroke!
      ctx
        ..fillStyle = \#fff
        ..fillText(title + '  ' + (map (.toFixed 3), it).toString!, 0, 0);
    else
      ctx
        ..fillStyle = \#2f2
      maxabs = maximum map abs, memo
      for m, i in memo
        #__ m[0], i
        x = 99-i
        h = (50 * (abs m) / (maxabs or 1))
        if m < 0 => y = 50
        else y = 50-(50*m/(maxabs or 1));
        if h == 0 then h = 1
        ctx
          ..fillRect x, y, 1, h
      ctx
        ..fillStyle = \#fff
        ..fillText(title + '  ' + it.toFixed(3).toString(), 0, 0);

  this


inner = (f, g, u, v) --> reduce g, zipWith f, u, v


gen-op = generalize_operator = (name, fn) -> op = (other) ->
  if other.length?
    zipWith
  for v, i in @
    if other[i].length?
      zipWith it[name]
  zipWith ~> if it.length? then it[name] @ else fn


class Tensor extends Array
  \+ : gen-op \+, (+)
  \- : gen-op \-, (-)
  \/ : gen-op \/, (/)
  \* : gen-op \*, (*)
  \. : -> inner (+), (*), @, it


#Array.prototype <<< Tensor.prototype
Array.prototype <<<
  \+ : -> zipWith (+), @ , it
  \- : -> zipWith (-), @ , it
  \/ : -> zipWith (/), @ , it
  \* : -> zipWith (*), @ , it
  \. : -> inner (+), (*), @, it






BLOCKSIZE = 50
ACCEL = 0.01
PLAYER_SIZE = [0.4 1]
GRAVITY = [0 -0.005]


MAP =[[0 0 0 0 0 0 0 0]
      [0 0 1 1 0 0 0 0]
      [0 0 0 0 0 0 0 0]
      [0 0 0 0 1 1 1 1]
      [1 1 0 0 0 0 0 0]
      [0 0 0 0 0 0 1 0]
      [0 0 0 0 1 0 1 0]
      [0 0 1 1 1 0 0 0]]

INITIAL_SPEED = [0 0]
INITIAL_POSITION = [0 7]


box = (x, y) ->

draw = (el, pos) -->
  [x, y] = map (*BLOCKSIZE), pos
  $ el .css {left: x, top: 350-y}

$ ->
  #__ MAP
  for x til 8
    for y til 8
      if MAP[7-y][x]
        $ \.ct .append el = $ "<div class='box'></div>"
        draw el, [x, y]

collide = (vel, pos) ->
  test-wall = (v, p, size) ->
    | v+p >= 8-size => (8-size)-p
    | v+p <= 0        => -p
    | _               => v
  zipAllWith test-wall, vel, pos, PLAYER_SIZE


collide-blocks = (vel, pos) ->
  test-block = (block, v, p) ->
    v\+p
    #min
    #| v+p

  blocks = []
  for x til 8
    for y til 8
      blocks.push [x, y] if MAP[y][y]

  for block in blocks
    zipAllWith test-block, block, vel, pos

  vel


controls = Keyboard.arrows!
  .lift ([x,y]) -> [x, (if y >= 0 then y else 0)]

acceleration = controls
  .lift map (* ACCEL)
  .lift -> it\+ GRAVITY
  .__ 'A', 'accel'

acceleration
  .lift -> it[1]
  .___ 'accel-y'

velocity = acceleration
  .sample-on Time.frame!
  #.control (-> position), (acc, pos) ->
  #  vel = acc\+ old_vel
  #  cvel = collide vel, position?_state || INITIAL_POSITION
  .foldp (acc, old_vel = INITIAL_SPEED) ->
    vel = acc\+ old_vel
    cvel = collide vel, position?_state || INITIAL_POSITION
  #  bvel = collide-blocks cvel, position?_state || INITIAL_POSITION
  .__ 'V', 'velocity'
  .___ 'velocity'

velocity
  .lift -> it[1]
  .___ 'velocity-y'

position = velocity
  .foldp (vel, pos = INITIAL_POSITION) -> vel\+ pos
  .__ 'P', 'position'

player = position
  #.lift __
  .lift draw \.player


