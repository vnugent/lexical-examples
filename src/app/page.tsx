import { CardButton, CardButtonProps } from "@/components/CardButton"

export const EXAMPLES_METADATA = {
  CUSTOM_NODE: {
    href: "/examples/custom-nodes",
    title: "Custom objects",
    summary: "Embed custom components in the editor",
    desc: "You can insert any arbitrary React components inside the editor by implementing your own node, extending the DecoratorNode.  Lexical will treat the node as a black box.  The possibilities are endless, eg. adding a calendar, a support ticket, or a custom chart, etc.",
  },
  FLOATING_TOOLBAR: {
    href: "/examples/floating-toolbar",
    title: "Floating toolbar",
    summary: "Floating text formatting toolbar with a modal link editing form.",
    desc: " The floating toolbar is based on the official playground's with two notable differences: 1. Users must click on a link to view/navigate/edit.  2. Link view and editing form are built on Shadcn UI Form, Popover and Popover.",
  },
}

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl my-16">
      <h1 className="text-foreground/80 text-4xl font-bold tracking-tight lg:text-5xl">
        Lexical examples
      </h1>
      <div className="mt-10 flex gap-6 w-full flex-wrap">
        {Object.values(EXAMPLES_METADATA).map(({ href, title, summary }) => (
          <CardButton key={href} href={href} title={title} summary={summary} />
        ))}
      </div>
    </main>
  )
}
