import { EXAMPLES_METADATA } from "@/app/page"
import EditorWithForcedLayout from "./Editor"
import { InfoPanel } from "@/components/InfoPanel"

export default function FloatingToolbarPage() {
  const { title, desc } = EXAMPLES_METADATA.FORCED_LAYOUT
  return (
    <>
      <InfoPanel title={title} desc={desc} />
      <EditorWithForcedLayout />
    </>
  )
}
