import { CardButton } from "@/components/CardButton"

export const EXAMPLES_METADATA = {
  CUSTOM_NODE: {
    href: "/examples/custom-nodes",
    title: "Embedded custom components",
    summary: "Embed any React components in the editor.",
    desc: "You can insert a React component inside the editor by implementing your own custom node, extending the built-in DecoratorNode.  Lexical treats a Decorator node as a black box which means you're free to render whatever you want.  You can embed a calendar or a support ticket...  The possibilities are endless.",
  },
  FLOATING_TOOLBAR: {
    href: "/examples/floating-toolbar",
    title: "Floating toolbar",
    summary: "Text formatting toolbar with a link editing form.",
    desc: " The floating toolbar is based on the official playground's with two notable differences: 1. You have to click on the link in order to open or edit the URL.  2. Link viewer and editing form are built on Shadcn UI Form, Popover and Dialog.",
  },
  FORCED_LAYOUT: {
    href: "/examples/forced-layout",
    title: "Forced layout",
    summary: "Always start the document with an H1 title.",
    desc: "Lexical doesn't support document schema (issue 3833), you can achieve a similar effect by manipulating the document structure in the node transform listeners.",
  },
}

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-2xl my-16">
        <h1 className="text-foreground/80 text-4xl font-bold tracking-tight lg:text-5xl">
          Lexical examples
        </h1>
        <div className="mt-10 flex gap-6 w-full flex-wrap">
          {Object.values(EXAMPLES_METADATA).map(({ href, title, summary }) => (
            <CardButton
              key={href}
              href={href}
              title={title}
              summary={summary}
            />
          ))}
        </div>
      </main>
    </>
  )
}
