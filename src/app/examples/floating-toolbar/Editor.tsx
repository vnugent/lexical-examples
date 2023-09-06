"use client"
import { useState } from "react"
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical"
import { $createLinkNode } from "@lexical/link"
import { LinkNode } from "@lexical/link"
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"

import FloatingTextFormatToolbarPlugin from "@/components/plugins/FloatingToolbarPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import FloatingLinkEditorPlugin from "@/components/plugins/FloatingLinkEditorPlugin"
import ExampleTheme from "@/components/exampleTheme"

/**
 * Editor with floating toolbar
 */
export default function Editor() {
  const initialConfig: InitialConfigType = {
    editorState: prepopulatedRichText,
    namespace: "floating-toolbar",
    theme: ExampleTheme,
    nodes: [LinkNode],
    onError(error: any) {
      throw error
    },
  }

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<
    HTMLDivElement | undefined
  >(undefined)
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container" ref={onRef}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-input"
              autoFocus
              spellCheck={false}
            />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {floatingAnchorElem != null && (
          <>
            <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
            <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
          </>
        )}
      </div>
      <HistoryPlugin />
      <LexicalClickableLinkPlugin />
      <LinkPlugin />
    </LexicalComposer>
  )
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some text...</div>
}

function prepopulatedRichText() {
  const root = $getRoot()
  if (root.getFirstChild() === null) {
    const paragraph = $createParagraphNode()
    paragraph.append(
      $createTextNode("This example is built with "),
      $createLinkNode("https://github.com/facebook/lexical").append(
        $createTextNode("@lexical/react")
      ),
      $createTextNode(".")
    )
    root.append(paragraph)
  }
}
