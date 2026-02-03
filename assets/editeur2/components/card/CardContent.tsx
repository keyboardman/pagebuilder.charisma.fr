import { cn } from "@editeur/lib/utils"
import { useCard } from "./Card"

type RootProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function Root({ children, className, style }: RootProps) {
  const { variant, align } = useCard()

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        variant === "overlay" &&
          "absolute inset-0 z-10 text-white",
        variant !== "overlay" && "flex-1 min-w-0",
        align === "start" && "justify-start",
        align === "center" && "justify-center",
        align === "end" && "justify-end",
        align === "stretch" && "justify-stretch",
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

function Title({ text, style, className }: { text: string; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      role="heading"
      aria-level={3}
      dangerouslySetInnerHTML={{ __html: text }}
      className={cn("node-block-title w-full leading-1.2 text-xl font-bold", className ?? "")}
      style={style ?? {}}
    />
  )
}

function Description({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground">{text}</p>
}

function Tag({ text }: { text: string }) {
  return (
    <span className="w-fit rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
      {text}
    </span>
  )
}

export const CardContent = Object.assign(Root, {
  Title,
  Description,
  Tag,
})
