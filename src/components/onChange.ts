import { $getRoot, $getSelection, EditorState } from "lexical"

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
export default function onChange(editorState: EditorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot()
    const selection = $getSelection()

    console.log(root, selection)
  })
}
