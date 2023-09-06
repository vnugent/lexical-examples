import { CardButton } from "@/components/CardButton"

export const EXAMPLES_METADATA = {
  CUSTOM_NODE: {
    href: "/examples/custom-nodes",
    title: "Embed custom components",
    summary: "How to embed custom React components in the editor.",
    desc: "You can insert a React component inside the editor by implementing your own custom node, extending DecoratorNode.  Lexical treats a Decoration node as a black box which means you're free to render whatever you want.  The possibilities are endless, eg. adding a calendar, a support ticket, or a custom chart, etc.",
  },
  FLOATING_TOOLBAR: {
    href: "/examples/floating-toolbar",
    title: "Floating toolbar",
    summary: "Text formatting toolbar with a link editing form.",
    desc: " The floating toolbar is based on the official playground's with two notable differences: 1. Users must click on the link in order to navigate or edit the url.  2. Link view and editing form are built on Shadcn UI Form, Popover and Popover.",
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
