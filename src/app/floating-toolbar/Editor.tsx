"use client"
import { useState } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import editorConfig from "@/components/editorConfig"
import { SerializerPreview } from "@/components/plugins/SerializerPreview"
import { DebugTreePlugin } from "@/components/plugins/DebugTreePlugin"
import FloatingTextFormatToolbarPlugin from "@/components/plugins/FloatingToolbarPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import FloatingLinkEditorPlugin from "@/components/plugins/FloatingLinkEditorPlugin2"

export default function Editor() {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<
    HTMLDivElement | undefined
  >(undefined)
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Toolbar />
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <div className="my-6 flex gap-8">
        <DebugTreePlugin />
        <SerializerPreview />
      </div>
      <HistoryPlugin />
      <LexicalClickableLinkPlugin />
      <LinkPlugin />
      <FloatingLinkEditorPlugin />
      <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
    </LexicalComposer>
  )
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some text...</div>
}

function Toolbar(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const onCreateTask = (e: React.MouseEvent): void => {
    // editor.dispatchCommand(INSERT_BANNER_COMMAND, undefined)
  }
  return (
    <div className="my-2 flex gap-2">
      {/* <Button onClick={onCreateTask}>Create Task</Button> */}
    </div>
  )
}
