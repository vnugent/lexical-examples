"use client"
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical"
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { DebugTreePlugin } from "@/components/plugins/DebugTreePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HeadingNode } from "@lexical/rich-text"

import ExampleTheme from "@/components/exampleTheme"
import { ForcedLayoutPlugin } from "@/components/plugins/ForcedLayoutPlugin"
import {
  $createTitleNode,
  TitleNode,
} from "@/components/plugins/ForcedLayoutPlugin/TitleNode"

/**
 * Editor with forced layout
 */
export default function Editor() {
  const initialConfig: InitialConfigType = {
    // editorState: prepopulatedRichText,
    namespace: "forced-layout",
    theme: { ...ExampleTheme, titlePlaceholder: "title-placeholder" },
    nodes: [TitleNode, HeadingNode],
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
      <div className="my-6">
        <DebugTreePlugin />
      </div>
      <HistoryPlugin />
      <ForcedLayoutPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  )
}

function prepopulatedRichText() {
  const root = $getRoot()

  root.append($createTitleNode("My story"))
  root.append(
    $createParagraphNode().append($createTextNode("This is a paragraph"))
  )
}
