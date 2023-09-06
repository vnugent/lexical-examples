import EditorWithEmbeddedComponents from "@/app/examples/custom-nodes/Editor"
import { InfoPanel } from "@/components/InfoPanel"
import { EXAMPLES_METADATA } from "@/app/page"

export default function Plain() {
  const { title, desc } = EXAMPLES_METADATA.CUSTOM_NODE
  return (
    <>
      <InfoPanel title={title} desc={desc} />
      <EditorWithEmbeddedComponents />
    </>
  )
}
