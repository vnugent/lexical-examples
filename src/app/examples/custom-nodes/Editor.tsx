"use client"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import {
  TaskPlugin,
  INSERT_BANNER_COMMAND,
} from "@/components/plugins/task/TaskPlugin"
import editorConfig from "@/components/editorConfig"
import { SerializerPreview } from "@/components/plugins/SerializerPreview"
import { DebugTreePlugin } from "@/components/plugins/DebugTreePlugin"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function Editor() {
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
      <TaskPlugin />
    </LexicalComposer>
  )
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some text...</div>
}

function Toolbar(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const onCreateTask = (e: React.MouseEvent): void => {
    editor.dispatchCommand(INSERT_BANNER_COMMAND, undefined)
  }
  return (
    <div className="my-2">
      <Button onClick={onCreateTask} size="sm" className="gap-2">
        <PlusIcon />
        Create Task
      </Button>
    </div>
  )
}
