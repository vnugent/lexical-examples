"use client"
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical"
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text"

import ExampleTheme from "@/components/exampleTheme"
import { ForcedLayoutPlugin } from "@/components/plugins/ForcedLayoutPlugin"

/**
 * Editor with forced layout
 */
export default function Editor() {
  const initialConfig: InitialConfigType = {
    editorState: prepopulatedRichText,
    namespace: "forced-layout",
    theme: { ...ExampleTheme, titlePlaceholder: "title-placeholder" },
    nodes: [HeadingNode],
    onError(error: any) {
      throw error
    },
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-input"
              autoFocus
              spellCheck={false}
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      <ForcedLayoutPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  )
}

function prepopulatedRichText() {
  const root = $getRoot()

  root.append(
    $createHeadingNode("h1").append($createTextNode("A Tale of Two Cities"))
  )
  root.append(
    $createParagraphNode().append(
      $createTextNode("It was the best of times, it was the worst of times.")
    )
  )
}
