import {
  NodeKey,
  EditorConfig,
  LexicalNode,
  $createTextNode,
  $setSelection,
  $getRoot,
} from "lexical"
import {
  HeadingNode,
  HeadingTagType,
  SerializedHeadingNode,
} from "@lexical/rich-text"

export class TitleNode extends HeadingNode {
  constructor(key?: NodeKey) {
    super("h1")
  }

  /**
   * Prevent empty node from being recreated
   */
  replace<N extends LexicalNode>(
    replaceWith: N,
    includeChildren?: boolean | undefined
  ): N {
    /**
     * For some reason when hitting backspace when the cursor is at position 0
     * will trigger a `replace()` call with this node converted to HeadingNode
     */
    if (replaceWith.getType() === HeadingNode.getType()) {
      replaceWith.remove()
      /**
       * Avoid error "selection has been lost because the previously selected nodes have been removed"
       */
      this.select()
    }
    return this as unknown as N
  }

  createDOM(config: EditorConfig): HTMLElement {
    if (this.getTextContent() === "") {
      const element = document.createElement("div")
      element.className = config.theme.titlePlaceholder
      element.setAttribute("data-placeholder", "1")
      return element
    }
    return super.createDOM(config)
  }

  updateDOM(prevNode: HeadingNode, dom: HTMLElement): boolean {
    if (!prevNode.isEmpty() && dom.getAttribute("data-placeholder") === "1") {
      return true
    }

    if (prevNode.isEmpty() && dom.getAttribute("data-placeholder") !== "1") {
      return true
    }
    return false
  }

  exportJSON(): SerializedHeadingNode {
    return super.exportJSON()
  }

  static importJSON(serializedNode: SerializedHeadingNode): TitleNode {
    return HeadingNode.importJSON(serializedNode)
  }

  static getType(): string {
    return "Title"
  }

  static clone(node: TitleNode): TitleNode {
    return new TitleNode()
  }
}

export const $createTitleNode = (title?: string): TitleNode => {
  const node = new TitleNode()
  if (title != null) {
    node.append($createTextNode(title))
  }
  return node
}
