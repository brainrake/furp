
inner = (f, g, u, v) --> reduce g, zipWith f, u, v


gen-op = generalize_operator = (name, fn) -> op = (other) ->
  if other.length?
    zipWith

  for v, i in @
    if other[i].length?
      zipWith it[name]
  #zipWith ~> if it.length? then it[name] @ else fn


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
