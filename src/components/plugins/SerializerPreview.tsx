import { useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState } from "lexical"
import { $getRoot, $getSelection } from "lexical"

export const SerializerPreview: React.FC = () => {
  const [editor] = useLexicalComposerContext()
  const [data, setData] = useState<string>()

  function onChange(editorState: EditorState) {
    editorState.read(() => {
      const jsonString = JSON.stringify(editorState, null, 2)
      setData(jsonString)
    })
  }

  return (
    <div>
      <h3>Document state in json</h3>
      <div className="font-mono text-xs whitespace-pre">
        <OnChangePlugin onChange={onChange} />
        <div>{data}</div>
      </div>
    </div>
  )
}
