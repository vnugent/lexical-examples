import { ChangeEventHandler } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { TaskNode } from "./TaskNode"
import { Button } from "@/components/ui/button"

interface TaskProps {
  title?: string
  desc?: string
  taskNode: TaskNode
}

export const TaskComponent: React.FC<TaskProps> = ({
  title,
  desc,
  taskNode,
}) => {
  const [editor] = useLexicalComposerContext()

  const onTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    editor.update(() => {
      taskNode.setTitle(e.target.value)
    })
  }

  const onDescChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    editor.update(() => {
      taskNode.setDescription(e.target.value)
    })
  }

  const onDelete = () => {
    editor.update(() => {
      taskNode.remove()
    })
  }

  return (
    <>
      <div className="my-2 flex justify-end">
        <Button onClick={onDelete} variant="destructive">
          Delete
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <input
          placeholder="Task title"
          value={title ?? ""}
          onChange={onTitleChange}
        />
        <textarea
          placeholder="Description"
          value={desc ?? ""}
          onChange={onDescChange}
        />
      </div>
    </>
  )
}
