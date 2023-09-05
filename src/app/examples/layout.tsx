import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/">
          <Button variant="ghost">
            <ChevronLeftIcon /> Back
          </Button>
        </Link>
      </nav>
      <section className="max-w-2xl mx-auto py-10">{children}</section>
    </>
  )
}
