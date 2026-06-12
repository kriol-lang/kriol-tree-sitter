[
  "fn"
  "dipoz"
  "inpristan"
] @keyword

[
  "si"
  "sinon"
  "pa"
  "nkuantu"
] @keyword.control

[
  "para"
  "kontinua"
  "divolvi"
] @keyword.control

[
  "num"
  "nter"
  "bool"
  "textu"
] @type.builtin

[
  "sin"
  "nau"
] @constant.builtin.boolean

[
  "mostra"
  "mostran"
  "sai"
  "konfirma"
] @function.builtin

(function_declaration
  name: (identifier) @function)

(call_expression
  function: (identifier) @function.call)

(parameter
  name: (identifier) @variable.parameter)

(identifier) @variable

(integer) @number
(float) @number
(string) @string
(fstring) @string
(fstring_text_double) @string
(fstring_text_single) @string

(comment) @comment

[
  "+"
  "-"
  "*"
  "/"
  "="
  "+="
  "-="
  "*="
  "/="
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "&&"
  "||"
  "!"
] @operator
