import { ChangeEventHandler } from "react"
import { TaskNode } from "./TaskPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
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

  return (
    <div className="bg-pink-100 rounded-md">
      <h2>Task</h2>
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
    </div>
  )
}
