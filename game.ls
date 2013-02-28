import furp
__ = -> console.log ...arguments;  it


ACCEL = 0.01
PLAYER_SIZE = [0.4 0.6]
GRAVITY = [0 -0.005]

MAP =[[0 0 0 0 0 0 0 0]
      [0 0 1 1 0 0 0 0]
      [0 0 0 0 0 0 0 0]
      [0 0 0 0 1 1 1 1]
      [1 1 0 0 0 0 0 0]
      [0 0 0 0 0 0 1 0]
      [0 0 0 0 0 0 0 0]
      [0 1 0 1 0 0 0 0]]

INITIAL_SPEED = [0 0]
INITIAL_POSITION = [0 7]


vadd = zipWith (+)
vsub = zipWith (-)
vlen = (v) -> sqrt v.0 ^ 2 + v.1 ^ 2
vdot = (a, b) -> fold (+), 0, zipWith (*), a, b
vangle = (a, b) -> (vdot a, b) / ((vlen a) * (vlen b))
vnorm = (v) -> [(v.0 / vlen v), (v.1 / vlen v)]

draw = (el, [x,y], [sx, sy]=[1 1]) ->
  $ el .css {left: x*50, top: 400 - sy*50 - y*50}

$ ->
  #__ MAP
  for x til 8
    for y til 8
      if MAP[7-y][x]
        $ \.ct .append el = $ "<div class='box'></div>"
        draw el, [x, y]

collide = (vel, pos) ->
  test-wall = (v, p, size) ->
    | v+p >= 8 - size => (8-size)-p - v
    | v+p <= 0        => (0-p) - v
    | _               => 0
  zipAllWith test-wall, vel, pos, PLAYER_SIZE

collide-blocks = (old_vel, cvel, pos) ->
  vel = cvel
  test-block = (block, size) ->
    test-overlap = (b, p, s) ->
      | b + 0.5 - s/2 < p     < b + 1  => p     - (b + 1)
      | b + 0.5 + s/2 > p + s > b      => p + s -  b
      | _ => 0

    overlap = zipAllWith test-overlap, block, (vadd vel, pos), size
    if (overlap.0 != 0) and (overlap.1 != 0)
      #__ vel, overlap
      #__ (vnorm overlap), (vnorm vel)
      if (abs (vnorm overlap).1) < (abs (vnorm vel).1)
        overlap[0] = 0
      else
        overlap[1] = 0
      #if (abs overlap.1) >= (abs vel.1)
      #  overlap[1] = 0
      #else if (abs overlap.0) >= (abs vel.0)
      #  overlap[0] = 0
      vsub vel, overlap
    else
      vel

  blocks = []
  for x til 8
    for y til 8
      blocks.push [x, y] if MAP[7-y][x]

  for block in blocks
    vel = test-block block, PLAYER_SIZE
  vsub vel, cvel



time = Time.frame!
  #.keep-when Keyboard.isDown 32

controls = Keyboard.arrows!
  .lift ([x,y]) -> [x, (if y >= 0 then y else 0)]


acceleration = controls
  .sample-on time
  .lift map (* ACCEL)
  .lift -> vadd it, GRAVITY
  #.control (-> collision), acc,



velocity = acceleration
  #.control (-> position), (acc, pos, vel) ->
  #  vel = vadd acc, old_vel
  #  collide (acc\ +vel), INITIAL_POSITION#pos || INITIAL_POSITION
  .foldp (acc, old_vel = INITIAL_SPEED) ->
    bvel = (vadd old_vel, acc)
    cvel = vadd bvel, (collide bvel, position?_state || INITIAL_POSITION)
    vvel = vadd cvel, collide-blocks old_vel, cvel, position?_state || INITIAL_POSITION


position = velocity
  .foldp (vel, pos = INITIAL_POSITION) -> vadd vel, pos


collision = Lift (pos, vel) ->




position.lift -> draw \.player, it, PLAYER_SIZE

position
  .___ 'position'
  .__ 'P', 'position'

velocity
  ..___ 'velocity'
  ..__ 'V', 'velocity'
  ..lift -> it[1]
    .___ 'velocity-y'
  ..lift -> it[0]
    .___ 'velocity-x'

acceleration
  .__ 'A', 'accel'
  .___ 'accel'

controls
  .__ 'C', 'controls'
  .___ 'controls'
