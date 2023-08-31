import { LinkNode } from '@lexical/link'
import { TaskNode } from '@/components/plugins/task/TaskPlugin'
import ExampleTheme from "./exampleTheme"

const editorConfig = {
  namespace: 'demo',
  theme: ExampleTheme,
  onError(error: any) {
    throw error
  },
  nodes: [TaskNode, LinkNode]
}

export default editorConfig
