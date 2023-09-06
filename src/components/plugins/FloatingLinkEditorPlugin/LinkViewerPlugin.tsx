"use client"
import * as Popover from "@radix-ui/react-popover"

import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  ElementNode,
  LexicalEditor,
  $createRangeSelection,
} from "lexical"

import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin"
import { useEffect, useState } from "react"
import { getSelectedNode } from "@/utils/getSelectedNode"
import { XIcon } from "lucide-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { sanitizeUrl } from "@/utils/url"
import { Button } from "@/components/ui/button"
import { EDIT_LINK_COMMAND } from "./LinkEditorPlugin"
import { getLinkNodeInfo } from "@/utils/getLinkNodeInfo"

/**
 * Detect a mouse click on a link and display a floating card
 * that allows users to navigate/edit/remove link.
 */
export const LinkViewerPlugin: React.FC<{
  editor: LexicalEditor
  anchorElem: HTMLElement
}> = ({ editor, anchorElem: anchorEl }): JSX.Element => {
  const [isLink, setIsLink] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [anchor, setAnchor] = useState({ x: 0, y: 0, h: 0 })

  useEffect(() => {
    if (isLink) {
      const nativeSelection = window.getSelection()
      const domRect: DOMRect | undefined =
        nativeSelection?.focusNode?.parentElement?.getBoundingClientRect()
      if (domRect != null) {
        const xOffset = domRect.width > 10 ? 5 : 0
        setAnchor({ x: domRect.x + xOffset, y: domRect.y, h: domRect.height })
      }
    }
  }, [isLink])

  useEffect(() => {
    if (isLink) {
      editor.getEditorState().read(() => {
        const { text, url } = getLinkNodeInfo()
        setLinkText(text)
        setLinkUrl(url)
      })
    }
  }, [editor, isLink])

  return (
    <>
      <NodeEventPlugin
        nodeType={ElementNode}
        eventType={"click"}
        eventListener={(e: Event) => {
          if (isLink) {
            setIsLink(false)
            return
          }
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection)

            const parent = node.getParent()
            const isUrl = $isLinkNode(parent)
            if (isUrl) {
              editor.update(() => {
                const selection = $createRangeSelection()
                selection.focus.set(node.getKey(), 0, "text")
                selection.anchor.set(
                  node.getKey(),
                  node.getTextContentSize(),
                  "text"
                )
                setIsLink(true)
                setLinkUrl(parent.getURL())
              })
              return
            }

            /**
             * Programatically select a single-letter link.
             * Since it's not easy to select a link with
             * just a single letter, we look before and after the
             * cursor to see either of its neigbor is a link with
             * a single letter.  If so, select the link.
             *
             * First, inspect the sibling on the left
             */
            const leftNode = node.getPreviousSibling()
            const isPrevALink =
              $isLinkNode(leftNode) && leftNode.getTextContentSize() === 1
            const cursorRightAfterLink =
              selection.isCollapsed() && selection.anchor.offset === 0
            if (isPrevALink && cursorRightAfterLink) {
              editor.update(() => {
                const selection = $createRangeSelection()
                const textNode = leftNode.getFirstChild()
                if (textNode == null) return
                selection.focus.set(textNode.getKey(), 0, "text")
                selection.anchor.set(textNode.getKey(), 1, "text")
                $setSelection(selection)
                setIsLink(true)
                setLinkUrl(leftNode.getURL())
              })
              return
            }

            /**
             * Inspect the sibling on the right
             */
            const rightNode = node.getNextSibling()
            const isAfterALink =
              $isLinkNode(rightNode) && rightNode.getTextContentSize() === 1
            const isCursorRightBeforeLink =
              selection.isCollapsed() &&
              node.getTextContentSize() === selection.anchor.offset

            if (isAfterALink && isCursorRightBeforeLink) {
              editor.update(() => {
                const selection = $createRangeSelection()
                const textNode = rightNode.getFirstChild()
                if (textNode == null) return
                selection.focus.set(textNode.getKey(), 0, "text")
                selection.anchor.set(textNode.getKey(), 1, "text")
                $setSelection(selection)
                setIsLink(true)
                setLinkUrl(rightNode.getURL())
              })
              return
            }
            setIsLink(false)
          }
          setIsLink(false)
        }}
      />
      <Popover.Root open={isLink}>
        <Popover.Anchor asChild>
          <div
            style={{
              display: isLink ? "block" : "none",
              position: "fixed",
              opacity: 1,
              left: anchor.x,
              top: anchor.y,
              height: anchor.h,
            }}
          />
        </Popover.Anchor>
        <Popover.Portal container={anchorEl}>
          <Popover.Content
            sideOffset={2}
            side="top"
            align="start"
            arrowPadding={8}
            collisionPadding={16}
          >
            <Card className="w-[350px]">
              <CardHeader>
                <div className="flex justify-between items-center gap-x-4 nowrap">
                  <CardTitle className="truncate">{linkText}</CardTitle>
                  <div>
                    <Popover.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLink(false)}
                      >
                        <XIcon size={16} />
                      </Button>
                    </Popover.Close>
                  </div>
                </div>
                <CardDescription className="truncate">
                  <a
                    href={sanitizeUrl(linkUrl)}
                    target="_new"
                    className="underline"
                  >
                    {linkUrl}
                  </a>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLink(false)
                    editor.dispatchCommand(EDIT_LINK_COMMAND, null)
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    editor.update(() => {
                      const selection = $getSelection()
                      if ($isRangeSelection(selection)) {
                        const node = getSelectedNode(selection)
                        node.getParent()?.selectStart()
                      }
                      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
                      setIsLink(false)
                    })
                  }}
                >
                  Remove
                </Button>
              </CardFooter>
            </Card>
            <Popover.Arrow className="w-4 h-2" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}
