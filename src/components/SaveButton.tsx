import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

export const SaveButton: React.FC = () => {
  const [editor] = useLexicalComposerContext()
  const onClick = () => {
    const editorState = editor.getEditorState()
    const jsonString = JSON.stringify(editorState)
    console.log("#output ", jsonString)
  }
  return <button onClick={onClick}>Save</button>
}
