[
  "fn"
  "dipoz"
  "inpristan"
  "molda"
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
  "i8"
  "i16"
  "i32"
  "i64"
  "u8"
  "u16"
  "u32"
  "u64"
  "f32"
  "f64"
  "isize"
  "usize"
] @type.builtin

(type_identifier) @type

[
  "sin"
  "nau"
] @constant.builtin.boolean

(function_declaration
  name: (identifier) @function)

(molda_declaration
  name: (type_identifier) @type.definition)

(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (identifier) @function.builtin
  (#any-of? @function.builtin "mostra" "mostran" "toma" "sai" "konfirma"))

(record_literal
  type: (type_identifier) @type)

(parameter
  name: (identifier) @variable.parameter)

(record_field_initializer
  name: (identifier) @property)

(member_access_expression
  member: (identifier) @property)

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
  "::"
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
