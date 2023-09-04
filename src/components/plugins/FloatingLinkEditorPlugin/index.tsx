import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"

import { LinkEditorPlugin } from "./LinkEditorPlugin"
import { LinkViewerPlugin } from "./LinkViewerPlugin"

export default function FloatingLinkEditorPlugin({
  anchorElem,
}: {
  anchorElem?: HTMLElement
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    editor.update(() => editor.focus())
  }, [editor])
  return (
    <>
      <LinkViewerPlugin anchorElem={anchorElem} editor={editor} />
      <LinkEditorPlugin editor={editor} />
    </>
  )
}
