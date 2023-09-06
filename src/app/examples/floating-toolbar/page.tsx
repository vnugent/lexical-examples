import { EXAMPLES_METADATA } from "@/app/page"
import EditorWithFloatingToolbar from "@/app/examples/floating-toolbar/Editor"
import { InfoPanel } from "@/components/InfoPanel"

export default function FloatingToolbarPage() {
  const { title, desc } = EXAMPLES_METADATA.FLOATING_TOOLBAR
  return (
    <>
      <InfoPanel title={title} desc={desc} />
      <EditorWithFloatingToolbar />
    </>
  )
}
