import {EditorView} from "@codemirror/next/view"
import {EditorState} from "@codemirror/next/state"
import {defaultHighlighter} from "@codemirror/next/highlight"
import {lineNumbers} from "@codemirror/next/gutter"
import {keymap} from "@codemirror/next/keymap"
import {baseKeymap} from "@codemirror/next/commands"
import {bracketMatching} from "@codemirror/next/matchbrackets"
import {closeBrackets} from "@codemirror/next/closebrackets"
import {specialChars} from "@codemirror/next/special-chars"
import {foldGutter} from "@codemirror/next/fold"

let json = String.raw`{
  "literals": [true, false, null],
  "numbers": [1, 123, 123.5, -123, 43e5, 23e-5, 23e+5],
  "strings": [
    "A simple string",
    "Escapes: \n\b\r\t",
    "Unicode: \u005c"
  ],
  {
    "let us": {
      "nest": ["some", "things"]
    }
  }
}`

import {parser} from "./dist/index"
import {Subtree} from  "lezer-tree"
import {LezerSyntax, foldNodeProp} from "@codemirror/next/syntax"
import {styleTags} from "@codemirror/next/highlight"

let jsonSyntax = new LezerSyntax(parser.withProps(
  foldNodeProp.add({
    Array(tree) { return {from: tree.start + 1, to: tree.end - 1} },
    Object(tree) { return {from: tree.start + 1, to: tree.end - 1} }
  }),
  styleTags({
    Number: 'number',
    String: 'string',
    'True False': 'atom',
    Null: 'null',
    PropertyName: 'propertyName'
  })
))

let view = new EditorView({state: EditorState.create({
  doc: json,
  extensions: [
    lineNumbers(),
    defaultHighlighter,
    keymap(baseKeymap),
    specialChars(),
    closeBrackets,
    bracketMatching(),
    foldGutter(),
    jsonSyntax
  ]
})})

document.body.appendChild(view.dom)
