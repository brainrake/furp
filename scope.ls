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
      for i from (min 64, memo.length-1) to 0 by -1
        if not memo[i]? then continue
        ctx
          ..strokeStyle = '#2'+ (16-(Math.round i/4)).toString(16) + '2'
          #..lineWidth = 2
          ..beginPath!
          ..moveTo 50.5, 50.5
          ..lineTo 50.5 + memo[i][0] / (maxabs or 1)*100, 50.5 - memo[i][1]/(maxabs or 1)* 100
          ..stroke!
      ctx
        ..strokeStyle = \#fff
        ..beginPath!
        ..moveTo 50.5, 50.5
        ..lineTo 50.5 + memo[0][0] / (maxabs or 1)*100, 50.5 - memo[0][1]/(maxabs or 1)* 100
        ..stroke!
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

