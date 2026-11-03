// Checks the word lists of the grammar and of the highlight queries against
// kriol-syntax, the single source of the language syntax.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  booleans,
  builtinFunctions,
  builtinTypes,
  controlKeywords,
  declarationKeywords,
} from 'kriol-syntax';

const highlights = readFileSync(new URL('../queries/highlights.scm', import.meta.url), 'utf8');
const grammar = readFileSync(new URL('../grammar.js', import.meta.url), 'utf8');

function quotedWords(text) {
  return [...text.matchAll(/"([^"]+)"/g)].map(([, word]) => word);
}

// The words of every `[ "a" "b" ] @capture` group with this capture.
function groupWords(capture) {
  const groups = highlights.matchAll(/\[([^\]]*)\]\s*(@[\w.]+)/g);
  return [...groups].filter(([, , name]) => name === capture).flatMap(([, words]) => quotedWords(words));
}

// The words of an `(#any-of? @capture "a" "b")` predicate.
function anyOfWords(capture) {
  const predicate = highlights.match(new RegExp(`\\(#any-of\\? ${capture.replace('.', '\\.')}([^)]*)\\)`));
  return predicate ? quotedWords(predicate[1]) : [];
}

function assertSameWords(actual, expected) {
  assert.deepEqual([...actual].sort(), [...expected].sort());
}

describe('highlight queries', () => {
  it('highlight the declaration keywords', () => {
    assertSameWords(groupWords('@keyword'), declarationKeywords);
  });

  it('highlight the control keywords', () => {
    assertSameWords(groupWords('@keyword.control'), controlKeywords);
  });

  it('highlight the builtin types', () => {
    assertSameWords(groupWords('@type.builtin'), builtinTypes);
  });

  it('highlight the booleans', () => {
    assertSameWords(groupWords('@constant.builtin.boolean'), booleans);
  });

  it('highlight the builtin functions', () => {
    assertSameWords(anyOfWords('@function.builtin'), builtinFunctions);
  });
});

describe('grammar', () => {
  it('knows every keyword, builtin type and boolean', () => {
    const missing = [...declarationKeywords, ...controlKeywords, ...builtinTypes, ...booleans]
      .filter((word) => !grammar.includes(`'${word}'`));

    assert.deepEqual(missing, []);
  });
});
