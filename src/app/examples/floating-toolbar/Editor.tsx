"use client"
import { useState } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"

import editorConfig from "@/components/editorConfig"
import FloatingTextFormatToolbarPlugin from "@/components/plugins/FloatingToolbarPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import FloatingLinkEditorPlugin from "@/components/plugins/FloatingLinkEditorPlugin"

export default function Editor() {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<
    HTMLDivElement | undefined
  >(undefined)
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
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

const DEFAULT_INITIAL_STATE = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "this is a ",
            type: "text",
            version: 1,
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "link",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "link",
            version: 1,
            rel: "noreferrer",
            target: null,
            title: null,
            url: "https://",
          },
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: ".",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "New line.",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}
