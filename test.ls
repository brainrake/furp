import furp

__ = -> console.log ...arguments;  it


$ ->
  $ '[data-signal]' .each (i, el) ->
    signal = eval ($ el).attr \data-signal
    signal.lift -> ($ el).text it

  DomEvent \click '#lang button'
    .lift -> it.target.innerText
    .lift ->
      for cls in [\js \cs \ls \all]
        $ '#ct' .removeClass cls
      $ '#ct' .addClass it

  for e in [\keydown \keyup \keypress]
    $ document .on e, ->
      if it.keyCode in [37 39 40 38 32]
        it.preventDefault!
      true
