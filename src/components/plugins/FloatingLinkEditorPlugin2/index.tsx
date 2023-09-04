/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import "./index.css"
import * as Popover from "@radix-ui/react-popover"

import {
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  ElementNode,
  GridSelection,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  $createRangeSelection,
} from "lexical"

import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin"
import { Dispatch, useEffect, useRef, useState } from "react"
import { getSelectedNode } from "@/utils/getSelectedNode"
import { XIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { setFloatingElemPositionForLinkEditor } from "@/utils/setFloatingElemPositionForLinkEditor"
import { sanitizeUrl } from "@/utils/url"
import { Button } from "@/components/ui/button"
import { LinkEditorPlugin, EDIT_LINK_COMMAND } from "./LinkEditorPlugin"
import { getLinkNodeInfo } from "@/utils/getLinkNodeInfo"

function FloatingLinkEditor({
  editor,
  isLink,
  setIsLink,
  anchorElem,
}: {
  editor: LexicalEditor
  isLink: boolean
  setIsLink: Dispatch<boolean>
  anchorElem?: HTMLElement
}): JSX.Element {
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
      <LinkEditorPlugin anchorElem={anchorElem} />
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
              position: "absolute",
              opacity: 1,
              left: anchor.x,
              top: anchor.y,
              height: anchor.h,
            }}
          />
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content
            sideOffset={10}
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
              <CardContent className="flex justify-end items-center gap-4">
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
              </CardContent>
            </Card>
            <Popover.Arrow className="fill-popover stroke-border w-4 h-2" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}

function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  anchorElem?: HTMLElement
): JSX.Element | null {
  const [activeEditor, setActiveEditor] = useState(editor)
  const [isLink, setIsLink] = useState(false)
  return (
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      anchorElem={anchorElem}
      setIsLink={setIsLink}
    />
  )
  // return (
  //   <FloatingLinkEditor
  //     editor={activeEditor}
  //     isLink={isLink}
  //     anchorElem={anchorElem}
  //     setIsLink={setIsLink}
  //   />
  // )
  // return createPortal(
  //   <FloatingLinkEditor
  //     editor={activeEditor}
  //     isLink={isLink}
  //     anchorElem={anchorElem}
  //     setIsLink={setIsLink}
  //   />,
  //   anchorElem
  // )
}

export default function FloatingLinkEditorPlugin({
  anchorElem,
}: {
  anchorElem?: HTMLElement
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  return useFloatingLinkEditorToolbar(editor, anchorElem)
}
