import { useEffect } from "react"
import {
  $createParagraphNode,
  RootNode,
  $createTextNode,
  ParagraphNode,
  $getRoot,
  $getSelection,
  RangeSelection,
  $isRangeSelection,
  $isNodeSelection,
} from "lexical"
import { HeadingNode } from "@lexical/rich-text"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"

import { $createTitleNode, TitleNode } from "./TitleNode"
import "./index.css"

/**
 * This plugin enforce an opening H1 that follows by one or more paragraphs.
 */
export function ForcedLayoutPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([TitleNode])) {
      throw new Error("TitleNode plugin not registered on editor")
    }

    return mergeRegister(
      // editor.registerUpdateListener(
      //   ({ editorState, normalizedNodes, prevEditorState }) => {
      //     editorState.read(() => {
      //       const root = $getRoot()
      //       // console.log("# ", root.getChildrenSize(), prevEditorState.read())
      //     })
      //     console.log("#norm", normalizedNodes)
      //   }
      // ),
      editor.registerNodeTransform(HeadingNode, (newNode: HeadingNode) => {
        editor.update(() => {
          const root = $getRoot()
          const firstParagraph = root.getChildAtIndex(1)
          if (firstParagraph == null) return
          if (firstParagraph.getKey() === newNode.getKey()) {
            console.log(
              "#update heading -> p",
              firstParagraph.getTextContentSize()
            )
            const p = $createParagraphNode()
            p.append($createTextNode(firstParagraph.getTextContent()))
            firstParagraph.replace(p)
            p.select()
            //firstParagraph.selectNext()
            // firstParagraph.remove()
          }
        })
      }),
      editor.registerNodeTransform(ParagraphNode, (pNode: ParagraphNode) => {
        editor.update(() => {
          const root = $getRoot()
          const firstParagraph = root.getChildAtIndex(1)
          if (root.getChildrenSize() < 3 || firstParagraph == null) return

          if (
            firstParagraph.getKey() == pNode.getKey() &&
            pNode.getChildrenSize() === 0
          ) {
            firstParagraph.remove()
            console.log("#delete new pNode")
          }
          console.log(
            "#pNode",
            pNode
            // pNode,
            // pNode.getAllTextNodes()
          )
        })
      }),
      editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
        editor.update(() => {
          console.log("# root update", rootNode.getChildren())
          /**
           * 1. Handle changes to the 1st child
           */
          const firstNode = rootNode.getFirstChild()

          // const currentSelection = $getSelection()
          // if (
          //   rootNode.getChildrenSize() > 2 &&
          //   (rootNode.getChildAtIndex(1) as ParagraphNode).isEmpty() &&
          //   $isRangeSelection(currentSelection)
          //   // currentSelection.focus.key === rootNode.getChildAtIndex(0)?.getKey()
          // ) {
          //   console.log(
          //     "# remove empty p",
          //     currentSelection.focus.key,
          //     rootNode.getChildAtIndex(1),
          //     $getSelection()
          //   )
          //   rootNode.getChildAtIndex(1)?.remove()
          //   rootNode.getChildAtIndex(1)?.selectNext()
          //   return
          // }

          if (firstNode == null) {
            return
          }

          // Convert first child (paragraph by default) to title
          if (firstNode.getType() !== TitleNode.getType()) {
            console.log("#convert 1st node to title")
            firstNode.replace($createTitleNode())
          }

          // create an empty paragaph following the title
          if (rootNode.getChildrenSize() === 1) {
            const emptyP = $createParagraphNode()
            rootNode.append(emptyP)
            return
          }
          /**
           * 2. Handle 2nd child (1st paragraph)
           */
          const firstParagraph = rootNode.getChildAtIndex(1)

          // console.log(
          //   "# 1st P",
          //   rootNode.getChildrenSize(),
          //   firstParagraph?.getTextContent()
          // )
          if (firstParagraph == null || firstNode == null) {
            return
          }

          const canConvertToParagraph =
            firstParagraph.getType() === TitleNode.getType() ||
            firstParagraph.getType() == HeadingNode.getType()

          // if (canConvertToParagraph) {
          //   const p = $createParagraphNode()
          //   p.append($createTextNode(firstParagraph.getTextContent()))
          //   firstNode.insertAfter(p)

          //   firstParagraph.remove()
          // }
        })
      }),
      /**
       * Dyanmically add/remove paragraph placeholder CSS
       */
      editor.registerMutationListener(ParagraphNode, (nodes, payload) => {
        editor.getEditorState().read(() => {
          const root = $getRoot()
          const firstParagraphKey = root.getChildAtIndex(1)?.getKey()

          /**
           * If there are more than 2 (ie at least 1 title + 2 paragraphs)
           * then clear placeholders.
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
