import {
  COMMAND_PRIORITY_LOW,
  createCommand,
  type EditorConfig,
  type LexicalNode,
  $getSelection,
  $isRangeSelection,
  ElementNode,
  type RangeSelection,
  $createParagraphNode,
  type NodeKey,
  SerializedElementNode,
  LexicalEditor,
} from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $wrapNodes } from "@lexical/selection"

export type SerializedTaskNode = {
  title?: string
} & SerializedElementNode

export class TaskNode extends ElementNode {
  title?: string
  assignee?: string

  constructor(title?: string, key?: NodeKey) {
    super(key)
    this.title = title ?? "Untitled task"
  }

  static getType(): string {
    return "task"
  }

  setTitle(title: string): void {
    super.getWritable().title = title
  }

  getTitle(): string | undefined {
    return super.getLatest().title
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <div className="bg-pink-100">
        <div className="">{this.title}</div>
      </div>
    )
  }

  static clone(node: TaskNode): TaskNode {
    return new TaskNode(node.title, node.__key)
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement("div")
    element.className = config.theme.task
    this.setTitle(super.getTextContent())

    return element
  }

  updateDOM(
    _prevNode: unknown,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return true
  }

  insertNewAfter(
    _selection: RangeSelection,
    restoreSelection?: boolean | undefined
  ): LexicalNode | null {
    const newBlock = $createParagraphNode()
    const direction = this.getDirection()
    newBlock.setDirection(direction)
    this.insertAfter(newBlock, restoreSelection)
    return newBlock
  }

  collapseAtStart(): boolean {
    const paragraph = $createParagraphNode()
    const children = this.getChildren()
    children.forEach((child) => paragraph.append(child))
    this.replace(paragraph)
    return true
  }

  exportJSON(): SerializedTaskNode {
    return {
      ...super.exportJSON(),
      title: this.title,
      type: this.getType(),
      version: 1,
    }
  }

  static importJSON(jsonNode: SerializedTaskNode): TaskNode {
    const node = $createTaskNode(jsonNode?.title ?? "Untitled task")
    return node
  }
}

export function $createTaskNode(title?: string): TaskNode {
  return new TaskNode(title)
}

export function $isBannerNode(node: LexicalNode): node is TaskNode {
  return node instanceof TaskNode
}

export const INSERT_BANNER_COMMAND = createCommand("insertBanner")

export function ActionPlugin(): null {
  const [editor] = useLexicalComposerContext()
  if (!editor.hasNodes([TaskNode])) {
    throw new Error("BannerPlugin: BannerNode not registered on editor")
  }
  editor.registerCommand(
    INSERT_BANNER_COMMAND,
    () => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, $createTaskNode)
      }
      return true
    },
    COMMAND_PRIORITY_LOW
  )
  return null
}
