import { useCard } from "./Card"
import { cn } from "@editeur/lib/utils"

type CardImageProps = {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}

export function CardImage({
  src,
  alt = "",
  className,
  style,
}: CardImageProps) {

  const { variant } = useCard()
  const _className = cn( "relative overflow-hidden", variant === "top" && "w-full", variant === "left" && "w-1/3", variant === "right" && "w-1/3", variant === "overlay" && "w-full", className ?? "")

  return (
    <div className={_className}>
        <img src={src} alt={alt} className={cn("h-full w-full object-cover", className ?? "")} style={style ?? {}} />
    </div>
    
  )
}
