import { basicSetup, EditorState, EditorView } from '@codemirror/next/basic-setup';

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

import {parser} from "./dist/index.es"
import {Subtree} from  "lezer-tree"
import {LezerSyntax, foldNodeProp} from "@codemirror/next/syntax"
import {styleTags} from "@codemirror/next/highlight"

let jsonSyntax = LezerSyntax.define(parser.withProps(
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
    basicSetup,
    jsonSyntax
  ]
})})

document.body.appendChild(view.dom)
