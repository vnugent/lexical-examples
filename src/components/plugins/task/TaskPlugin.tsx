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
  SerializedLexicalNode,
  LexicalEditor,
  DecoratorNode,
  $insertNodes,
  $isRootOrShadowRoot,
} from "lexical"
import { $wrapNodeInElement, $insertNodeToNearestRoot } from "@lexical/utils"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $wrapNodes } from "@lexical/selection"
import { TaskComponent } from "./TaskComponent"

export type SerializedTaskNode = {
  title?: string
  desciption?: string
} & SerializedLexicalNode

export class TaskNode extends DecoratorNode<JSX.Element> {
  __title?: string
  __description?: string

  constructor(title?: string, desc?: string, key?: NodeKey) {
    super(key)
    this.__title = title
    this.__desc = desc
  }

  static getType(): string {
    return "task"
  }

  setTitle(title: string): void {
    super.getWritable().__title = title
  }

  getTitle(): string | undefined {
    return super.getLatest().__title
  }

  setDescription(desc?: string): void {
    super.getWritable().__desc = desc
  }

  getDescription(): string | undefined {
    return super.getLatest().__desc
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <TaskComponent title={this.__title} desc={this.__desc} taskNode={this} />
    )
  }

  static clone(node: TaskNode): TaskNode {
    return new TaskNode(node.__title, node.__description, node.__key)
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement("div")
    element.className = config.theme.task
    return element
  }

  updateDOM(
    _prevNode: unknown,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return false
  }

  // insertNewAfter(
  //   _selection: RangeSelection,
  //   restoreSelection?: boolean | undefined
  // ): LexicalNode | null {
  //   const newBlock = $createParagraphNode()
  //   const direction = this.getDirection()
  //   newBlock.setDirection(direction)
  //   this.insertAfter(newBlock, restoreSelection)
  //   return newBlock
  // }

  exportJSON(): SerializedTaskNode {
    return {
      title: this.getTitle(),
      desciption: this.getDescription(),
      type: this.getType(),
      version: 1,
    }
  }

  static importJSON(jsonNode: SerializedTaskNode): TaskNode {
    const node = $createTaskNode()
    return node
  }
}

export function $createTaskNode(): TaskNode {
  return new TaskNode()
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
      const taskNode = $createTaskNode()
      // $insertNodes([taskNode])
      $insertNodeToNearestRoot(taskNode)
      // if ($isRootOrShadowRoot(taskNode.getParentOrThrow())) {
      //   $wrapNodeInElement(taskNode, $createParagraphNode).selectEnd()
      // }
      return true
    },
    COMMAND_PRIORITY_LOW
  )
  return null
}
