import Link from "next/link"
import { Card, CardHeader, CardDescription, CardTitle } from "./ui/card"

export interface CardButtonProps {
  href: string
  title: string
  desc: string
}
export const CardButton: React.FC<CardButtonProps> = ({
  title,
  href,
  desc,
}) => {
  return (
    <Link href={href} prefetch={false}>
      <button>
        <Card className="w-[320px]">
          <CardHeader className="text-left">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </CardHeader>
        </Card>
      </button>
    </Link>
  )
}
