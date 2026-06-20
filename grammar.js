const PREC = {
  ASSIGN: 1,
  OR: 2,
  AND: 3,
  EQUALITY: 4,
  RELATIONAL: 5,
  ADD: 6,
  MULTIPLY: 7,
  UNARY: 8,
  CALL: 9,
};

module.exports = grammar({
  name: 'kriol',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  supertypes: $ => [
    $.statement,
    $.expression,
    $.initializer,
  ],

  rules: {
    source_file: $ => repeat($.statement),

    statement: $ => choice(
      $.expression_statement,
      $.compound_statement,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.break_statement,
      $.continue_statement,
      $.return_statement,
      $.sai_statement,
      $.konfirma_statement,
      $.function_declaration,
      $.molda_declaration,
      $.variable_declaration,
      $.import_statement,
    ),

    import_statement: $ => seq(
      'inpristan',
      field('path', $.string),
    ),

    variable_declaration: $ => choice(
      seq(
        field('type', $.type),
        field('declarator', choice(
          $.identifier,
          $.array_declarator,
        )),
        '=',
        field('value', $.initializer),
        ';',
      ),
      seq(
        'dipoz',
        field('type', $.type),
        field('declarator', choice(
          $.identifier,
          $.array_declarator,
        )),
        ';',
      ),
    ),

    array_declarator: $ => seq(
      '[',
      field('size', $.integer),
      ']',
      field('name', $.identifier),
    ),

    initializer: $ => choice(
      $.array_repeat_expression,
      $.array_literal,
      $.expression,
    ),

    array_repeat_expression: $ => seq(
      field('value', $.array_literal),
      '*',
      field('count', $.integer),
    ),

    array_literal: $ => seq(
      '[',
      optional(seq(
        $.expression,
        repeat(seq(',', $.expression)),
        optional(','),
      )),
      ']',
    ),

    typed_array_literal: $ => seq(
      '<',
      field('type', $.type),
      '>',
      field('value', $.array_literal),
    ),

    function_declaration: $ => seq(
      'fn',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      optional(field('return_type', $.type)),
      field('body', $.compound_statement),
    ),

    molda_declaration: $ => seq(
      'molda',
      field('name', $.type_identifier),
      '{',
      repeat($.molda_field_declaration),
      '}',
    ),

    molda_field_declaration: $ => seq(
      field('type', $.type),
      field('declarator', choice(
        $.identifier,
        $.array_declarator,
      )),
      ';',
    ),

    parameter_list: $ => seq(
      '(',
      optional(seq(
        $.parameter,
        repeat(seq(',', $.parameter)),
        optional(','),
      )),
      ')',
    ),

    parameter: $ => seq(
      field('type', $.type),
      field('name', $.identifier),
    ),

    compound_statement: $ => seq(
      '{',
      repeat($.statement),
      '}',
    ),

    if_statement: $ => prec.right(seq(
      'si',
      field('condition', $.expression),
      field('consequence', $.compound_statement),
      optional(seq(
        'sinon',
        field('alternative', choice(
          $.compound_statement,
          $.if_statement,
        )),
      )),
    )),

    while_statement: $ => seq(
      'nkuantu',
      field('condition', $.expression),
      field('body', $.compound_statement),
    ),

    for_statement: $ => seq(
      'pa',
      field('initializer', $.expression),
      ';',
      field('condition', $.expression),
      ';',
      field('update', $.expression),
      field('body', $.compound_statement),
    ),

    break_statement: _ => seq('para', ';'),
    continue_statement: _ => seq('kontinua', ';'),

    return_statement: $ => seq(
      'divolvi',
      optional(field('value', $.expression)),
      ';',
    ),

    sai_statement: $ => seq(
      'sai',
      '(',
      optional(field('value', $.expression)),
      ')',
      ';',
    ),

    konfirma_statement: $ => seq(
      'konfirma',
      '(',
      optional(field('value', $.expression)),
      ')',
      ';',
    ),

    expression_statement: $ => seq(
      optional($.expression),
      ';',
    ),

    expression: $ => choice(
      $.assignment_expression,
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.array_access_expression,
      $.member_access_expression,
      $.qualified_access_expression,
      $.parenthesized_expression,
      $.record_literal,
      $.typed_array_literal,
      $.identifier,
      $.literal,
    ),

    assignment_expression: $ => prec.right(PREC.ASSIGN, seq(
      field('left', choice(
        $.identifier,
        $.array_access_expression,
        $.member_access_expression,
        $.parenthesized_expression,
      )),
      field('operator', $.assignment_operator),
      field('right', $.expression),
    )),

    assignment_operator: _ => choice('=', '+=', '-=', '*=', '/='),

    binary_expression: $ => choice(
      ...[
        ['||', PREC.OR],
        ['&&', PREC.AND],
        ['==', PREC.EQUALITY],
        ['!=', PREC.EQUALITY],
        ['<', PREC.RELATIONAL],
        ['<=', PREC.RELATIONAL],
        ['>', PREC.RELATIONAL],
        ['>=', PREC.RELATIONAL],
        ['+', PREC.ADD],
        ['-', PREC.ADD],
        ['*', PREC.MULTIPLY],
        ['/', PREC.MULTIPLY],
      ].map(([operator, precedence]) => prec.left(precedence, seq(
        field('left', $.expression),
        field('operator', operator),
        field('right', $.expression),
      ))),
    ),

    unary_expression: $ => prec.right(PREC.UNARY, seq(
      field('operator', choice('!', '-')),
      field('argument', $.expression),
    )),

    call_expression: $ => prec(PREC.CALL, seq(
      field('function', choice(
        $.identifier,
        $.member_access_expression,
        $.qualified_access_expression,
        'mostra',
        'mostran',
      )),
      field('arguments', $.argument_list),
    )),

    argument_list: $ => seq(
      '(',
      optional(seq(
        $.expression,
        repeat(seq(',', $.expression)),
        optional(','),
      )),
      ')',
    ),

    array_access_expression: $ => prec(PREC.CALL, seq(
      field('array', choice(
        $.identifier,
        $.member_access_expression,
        $.qualified_access_expression,
        $.parenthesized_expression,
      )),
      '[',
      field('index', $.expression),
      ']',
    )),

    member_access_expression: $ => prec(PREC.CALL, seq(
      field('object', choice(
        $.identifier,
        $.array_access_expression,
        $.member_access_expression,
        $.qualified_access_expression,
        $.parenthesized_expression,
      )),
      '.',
      field('member', $.identifier),
    )),

    qualified_access_expression: $ => prec(PREC.CALL, seq(
      field('qualifier', choice(
        $.identifier,
        $.type_identifier,
        $.member_access_expression,
        $.qualified_access_expression,
        $.parenthesized_expression,
      )),
      '::',
      field('member', $.identifier),
    )),

    parenthesized_expression: $ => seq(
      '(',
      $.expression,
      ')',
    ),

    record_literal: $ => seq(
      field('type', $.type_identifier),
      '::',
      '{',
      optional(seq(
        $.record_field_initializer,
        repeat(seq(',', $.record_field_initializer)),
        optional(','),
      )),
      '}',
    ),

    record_field_initializer: $ => seq(
      field('name', $.identifier),
      ':',
      field('value', $.initializer),
    ),

    literal: $ => choice(
      $.integer,
      $.float,
      $.boolean,
      $.string,
      $.fstring,
    ),

    fstring: $ => choice(
      seq(
        'f"',
        repeat(choice($.fstring_text_double, $.interpolation)),
        '"',
      ),
      seq(
        "f'",
        repeat(choice($.fstring_text_single, $.interpolation)),
        "'",
      ),
    ),

    interpolation: $ => seq(
      '{',
      $.expression,
      '}',
    ),

    fstring_text_double: _ => token.immediate(prec(1, /([^"\\{\n]|\\.)+/)),
    fstring_text_single: _ => token.immediate(prec(1, /([^'\\{\n]|\\.)+/)),

    string: _ => choice(
      token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"')),
      token(seq("'", repeat(choice(/[^'\\\n]/, /\\./)), "'")),
    ),

    type: _ => choice(
      'num',
      'nter',
      'bool',
      'textu',
      'i8',
      'i16',
      'i32',
      'i64',
      'u8',
      'u16',
      'u32',
      'u64',
      'f32',
      'f64',
      'isize',
      'usize',
      $.type_identifier,
    ),

    boolean: _ => choice('sin', 'nau'),
    float: _ => /[+-]?\d+\.\d+/,
    integer: _ => /[+-]?\d+/,
    type_identifier: _ => /[A-Z][A-Za-z0-9_]*/,
    identifier: _ => /[a-z_][A-Za-z0-9_]*/,

    comment: _ => token(choice(
      seq('//', /[^\n]*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
    )),
  },
});
