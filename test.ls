import furp
__ = -> console.log ...arguments;  it

$ ->
  $ '[data-signal]' .each (i, el) ->
    signal = eval ($ el).attr \data-signal
      .lift -> $ el .text it
      .latch 100
      .lift -> $ el .toggleClass \red, it

  DomEvent \click '#lang button'
    .lift -> it.target.innerText
    .lift -> $ '#ct' .attr \class, it

  for event in [\keydown \keyup \keypress]
    DomEvent event
      .lift -> it.preventDefault! if it.keyCode in [37 39 40 38 32]


