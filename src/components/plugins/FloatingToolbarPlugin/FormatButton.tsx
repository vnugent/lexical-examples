import { MouseEventHandler, SVGProps } from "react"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

export interface FormatButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  active: boolean
  ariaLabel: string
  Icon: LucideIcon
}

export const FormatButton: React.FC<FormatButtonProps> = ({
  onClick,
  active,
  Icon,
  ariaLabel,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={active ? "outline" : "ghost"}
      size="sm"
      className={active ? "bg-muted" : ""}
      aria-label={ariaLabel}
    >
      <Icon size={14} strokeWidth={4} opacity={active ? "1" : "0.45"} />
    </Button>
  )
}
