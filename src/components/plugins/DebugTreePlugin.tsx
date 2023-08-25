import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { TreeView } from "@lexical/react/LexicalTreeView"

export const DebugTreePlugin: React.FC = () => {
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
