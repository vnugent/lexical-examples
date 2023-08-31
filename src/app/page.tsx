import { CardButton, CardButtonProps } from "@/components/CardButton"

const DEMOS: CardButtonProps[] = [
  {
    href: "/custom-nodes",
    title: "Custom objects",
    desc: "Embed custom components in editor",
  },
  {
    href: "/floating-toolbar",
    title: "Floating toolbar",
    desc: "Show toolbar above selected text",
  },
]

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl my-16">
      <div className="flex gap-6 w-full flex-wrap">
        {DEMOS.map((demo) => (
          <CardButton key={demo.href} {...demo} />
        ))}
      </div>
    </main>
  )
}
