"use client"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { TreeView } from "@lexical/react/LexicalTreeView"

import { ActionPlugin, INSERT_BANNER_COMMAND } from "./plugins/task/TaskPlugin"
import onChange from "./onChange"
import editorConfig from "./plugins/task/editorConfig"
import { SaveButton } from "./SaveButton"

export default function PlainTextEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="mt-16">
        <Toolbar />
        <div className="bg-blue-100">
          <div className="editor-container">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            {/* <OnChangePlugin onChange={onChange} /> */}
            <HistoryPlugin />
            <ActionPlugin />
          </div>
        </div>
        <DebugTree />
      </div>
    </LexicalComposer>
  )
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>
}

function Toolbar(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const onCreateTask = (e: React.MouseEvent): void => {
    editor.dispatchCommand(INSERT_BANNER_COMMAND, undefined)
  }
  return (
    <div className="my-2 flex gap-2">
      <button onClick={onCreateTask}>Create Task</button>
      <SaveButton />
    </div>
  )
}

const DebugTree: React.FC = () => {
  const [editor] = useLexicalComposerContext()
  return (
    <TreeView
      editor={editor}
      viewClassName="tree-view-output"
      treeTypeButtonClassName="debug-treetype-button"
      timeTravelPanelClassName="debug-timetravel-panel"
      timeTravelButtonClassName="debug-timetravel-button"
      timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
      timeTravelPanelButtonClassName="debug-timetravel-panel-button"
    />
  )
}
