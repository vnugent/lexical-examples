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
import { Dispatch, useCallback, useEffect, useRef, useState } from "react"
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

function FloatingLinkEditor({
  editor,
  isLink,
  setIsLink,
  anchorElem,
}: {
  editor: LexicalEditor
  isLink: boolean
  setIsLink: Dispatch<boolean>
  anchorElem: HTMLElement
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [editedLinkUrl, setEditedLinkUrl] = useState("")
  const [isEditMode, setEditMode] = useState(false)
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | GridSelection | NodeSelection | null
  >(null)

  const [anchor, setAnchor] = useState({ x: 0, y: 0, h: 0 })
  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl("")
      }
    }
    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect: DOMRect | undefined =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect()
      if (domRect) {
        domRect.y += 40
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem)
      }
      setLastSelection(selection)
    } else if (!activeElement || activeElement.className !== "link-input") {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem)
      }
      setLastSelection(null)
      setEditMode(false)
      setLinkUrl("")
    }

    return true
  }, [anchorElem, editor])

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor()
      })
    }

    window.addEventListener("resize", update)

    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update)
    }

    return () => {
      window.removeEventListener("resize", update)

      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update)
      }
    }
  }, [anchorElem.parentElement, editor, updateLinkEditor])

  // useEffect(() => {
  //   if (isEditMode && inputRef.current) {
  //     inputRef.current.focus()
  //   }
  // }, [isEditMode])

  useEffect(() => {
    if (isLink) {
      // editor.getEditorState().read(() => {
      //   updateLinkEditor()
      // })
      const nativeSelection = window.getSelection()
      const domRect: DOMRect | undefined =
        nativeSelection?.focusNode?.parentElement?.getBoundingClientRect()
      if (domRect != null) {
        const xOffset = domRect.width > 10 ? 5 : 0
        setAnchor({ x: domRect.x + xOffset, y: domRect.y, h: domRect.height })
      }
      console.log("# Dom Rect", domRect)
    }
  }, [isLink, updateLinkEditor])
  console.log("#linkEditor")

  return (
    <>
      <NodeEventPlugin
        nodeType={ElementNode}
        eventType={"click"}
        eventListener={(e: Event) => {
          console.log("#click", e.target)
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
                $setSelection(selection)
                setIsLink(true)
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
            const p = node.getPreviousSibling()
            const isPrevALink = $isLinkNode(p) && p.getTextContentSize() === 1
            const cursorRightAfterLink =
              selection.isCollapsed() && selection.anchor.offset === 0
            if (isPrevALink && cursorRightAfterLink) {
              editor.update(() => {
                const selection = $createRangeSelection()
                const textNode = p.getFirstChild()
                if (textNode == null) return
                selection.focus.set(textNode.getKey(), 0, "text")
                selection.anchor.set(textNode.getKey(), 1, "text")
                $setSelection(selection)
                setIsLink(true)
              })
              return
            }

            /**
             * Inspect the sibling on the right
             */
            const after = node.getNextSibling()
            const isAfterALink =
              $isLinkNode(after) && after.getTextContentSize() === 1
            const isCursorRightBeforeLink =
              selection.isCollapsed() &&
              node.getTextContentSize() === selection.anchor.offset

            if (isAfterALink && isCursorRightBeforeLink) {
              editor.update(() => {
                const selection = $createRangeSelection()
                const textNode = after.getFirstChild()
                if (textNode == null) return
                selection.focus.set(textNode.getKey(), 0, "text")
                selection.anchor.set(textNode.getKey(), 1, "text")
                $setSelection(selection)
                setIsLink(true)
              })
              return
            }
            setIsLink(false)
          }
          setIsLink(false)
          // return false

          // console.log("#Click on link", e.target)
          // e.stopPropagation()
        }}
      />
      <Popover.Root open={isLink}>
        <Popover.Anchor asChild>
          <div
            style={{
              display: isLink ? "block" : "none",
              position: "absolute",
              opacity: 0,
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
            collisionPadding={24}
          >
            <Card className="w-[350px]">
              <Popover.Close className="absolute right-4 top-4" asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLink(false)}
                >
                  <XIcon size={24} />
                </Button>
              </Popover.Close>
              <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>
                  Deploy your new project in one-click.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end items-center gap-4">
                <Button variant="outline">Edit</Button>
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
      {/* {!isLink ? null : isEditMode ? (
        <div className="bg-blue-200">Edit mode</div>
      ) : (
        <div className="link-view">
          <a
            href={sanitizeUrl(linkUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate min-w-[80px]"
          >
            {linkUrl}
          </a>
          <div className="flex nowrap">
            <Button
              size="sm"
              variant="link"
              onClick={() => {
                setEditedLinkUrl(linkUrl)
                setEditMode(true)
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      )} */}
    </>
  )
}

function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement
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
  anchorElem = document?.body,
}: {
  anchorElem?: HTMLElement
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  return useFloatingLinkEditorToolbar(editor, anchorElem)
}
