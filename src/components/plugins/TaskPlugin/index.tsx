import { useEffect } from "react"

import { createCommand, COMMAND_PRIORITY_NORMAL } from "lexical"
import { $insertNodeToNearestRoot } from "@lexical/utils"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { TaskNode, $createTaskNode } from "./TaskNode"

export const INSERT_TASK_COMMAND = createCommand("insertTask")

export function TaskPlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([TaskNode])) {
      throw new Error("TaskPlugin: TaskPlugin not registered on editor")
    }
    return editor.registerCommand(
      INSERT_TASK_COMMAND,
      () => {
        const taskNode = $createTaskNode()
        $insertNodeToNearestRoot(taskNode)
        return true
      },
      COMMAND_PRIORITY_NORMAL
    )
  }, [editor])

  return null
}
