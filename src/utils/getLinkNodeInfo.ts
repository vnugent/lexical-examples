import { $getSelection, $isRangeSelection } from 'lexical'
import {
  $isLinkNode,
} from "@lexical/link"

import { getSelectedNode } from './getSelectedNode'

/**
 * get current link node info, url and text
 */
export const getLinkNodeInfo = () => {
  const selection = $getSelection()
  if ($isRangeSelection(selection)) {
    const node = getSelectedNode(selection)
    const parent = node.getParent()
    var url = ""
    const text = parent.getTextContent()
    if ($isLinkNode(parent)) {
      url = parent.getURL()
    } else if ($isLinkNode(node)) {
      url = node.getURL()
    }
    return { text, url }
  }
  return { text: "", url: "" }
}