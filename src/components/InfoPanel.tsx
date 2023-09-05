import { HelpCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const InfoPanel: React.FC<{ title: string; desc: string }> = ({
  title,
  desc,
}) => (
  <div className="mb-10">
    <Alert variant="default">
      <HelpCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{desc}</AlertDescription>
    </Alert>
  </div>
)
