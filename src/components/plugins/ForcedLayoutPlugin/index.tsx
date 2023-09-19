import { useEffect } from "react"
import {
  $createParagraphNode,
  RootNode,
  $createTextNode,
  ParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from "lexical"
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"

import "./index.css"

/**
 * This plugin enforces an opening H1 that follows by one or more paragraphs.
 */
export function ForcedLayoutPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([HeadingNode])) {
      throw new Error("HeadingNode not registered with editor")
    }

    let prevChildSize: number | null = null

    return mergeRegister(
      /**
       * Enforce a single line H1. If the heading is split in 2 by pressing
       * the enter key, convert the new H1 to a paragraph.
       */
      editor.registerNodeTransform(HeadingNode, (newNode: HeadingNode) => {
        editor.update(() => {
          const root = $getRoot()
          const firstParagraph = root.getChildAtIndex(1)
          if (firstParagraph?.getKey() === newNode.getKey()) {
            const p = $createParagraphNode()
            p.append($createTextNode(firstParagraph.getTextContent()))
            firstParagraph.replace(p)
            p.selectStart()
          }
        })
      }),
      /**
       * Pressing Enter while the cursor is at the end of the title will
       * generate a new paragraph. We simply remove the newly generated
       * paragraph node and move the cursor down.
       */
      editor.registerNodeTransform(ParagraphNode, (pNode: ParagraphNode) => {
        editor.update(() => {
          const root = $getRoot()
          const firstParagraph = root.getChildAtIndex(1)

          if (root.getChildrenSize() < 3 || firstParagraph == null) return

          const currentSelection = $getSelection()

          if (
            currentSelection == null ||
            !$isRangeSelection(currentSelection)
          ) {
            return
          }

          const isCursorOnTitle =
            currentSelection.isCollapsed() &&
            currentSelection.anchor.key === firstParagraph.getKey()

          if (
            firstParagraph.getKey() == pNode.getKey() &&
            isCursorOnTitle &&
            prevChildSize === root.getChildrenSize() - 1
          ) {
            pNode.remove()
            const p = root.getChildAtIndex(1) as ParagraphNode
            p?.selectEnd()
          }
        })
      }),
      /**
       * Initialize the document structure
       */
      editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
        editor.update(() => {
          const firstNode = rootNode.getFirstChild()

          if (firstNode == null) {
            return
          }

          // Convert first child (a paragraph by default) to an H1 title
          if (firstNode.getType() !== HeadingNode.getType()) {
            firstNode.replace($createHeadingNode("h1"))
          }

          // Create an empty paragraph following the title
          if (rootNode.getChildrenSize() === 1) {
            const emptyP = $createParagraphNode()
            rootNode.append(emptyP)
          }
          prevChildSize = rootNode.getChildrenSize()
        })
      }),
      /**
       * Add/remove H1 placeholder CSS
       */
      editor.registerMutationListener(HeadingNode, (nodes, payload) => {
        editor.getEditorState().read(() => {
          const root = $getRoot()
          for (const [key, mutation] of nodes.entries()) {
            if (mutation === "created" || mutation === "updated") {
              const titleDiv = editor.getElementByKey(key)

              if (titleDiv === null) continue
              titleDiv.classList.toggle(
                "title-placeholder",
                titleDiv.textContent == null || titleDiv.textContent === ""
              )
            }
          }
        })
      }),
      /**
       * Add/remove paragraph placeholder CSS
       */
      editor.registerMutationListener(ParagraphNode, (nodes, payload) => {
        editor.getEditorState().read(() => {
          const root = $getRoot()
          const firstParagraphKey = root.getChildAtIndex(1)?.getKey()

          /**
           * If there are more than 2 nodes (ie at least 1 title + 2 paragraphs)
           * then clear paragraph placeholders.
           */
          if (root.getChildrenSize() > 2) {
            const keys = root.getChildrenKeys()

            editor
              .getElementByKey(keys[1])
              ?.classList.remove("paragraph-placeholder")
            editor
              .getElementByKey(keys[2])
              ?.classList.remove("paragraph-placeholder")

            return
          }

          for (const [key, mutation] of nodes.entries()) {
            if (
              (mutation === "created" || mutation === "updated") &&
              key === firstParagraphKey
            ) {
              const newP = editor.getElementByKey(key)

              if (newP === null) continue
              newP.classList.toggle(
                "paragraph-placeholder",
                newP.textContent == null || newP.textContent === ""
              )
            }
          }
        })
      })
    )
  }, [editor])

  return null
}
