import * as React from "react"

import { cn } from "@editeur/lib/utils"
import { Card, CardContent } from "@editeur/components/ui/card"
import { Badge } from "@editeur/components/ui/badge"

/**
 * Position de l'image dans la card
 */
export type ImagePosition = "left" | "top" | "right"

/**
 * Props pour le composant CardAdvanced
 */
export interface CardAdvancedProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Titre de la card (optionnel)
   */
  title?: string

  /**
   * Sous-titre de la card (optionnel)
   */
  subtitle?: string

  /**
   * URL de l'image (optionnel)
   */
  image?: string

  /**
   * Texte alternatif pour l'image
   */
  imageAlt?: string

  /**
   * Liste des mots-clés à afficher (optionnel)
   */
  keywords?: string[]

  /**
   * Position de l'image (défaut: "top")
   */
  imagePosition?: ImagePosition

  /**
   * Classes CSS personnalisées pour le titre
   */
  titleClassName?: string

  /**
   * Styles inline personnalisés pour le titre
   */
  titleStyle?: React.CSSProperties

  /**
   * Classes CSS personnalisées pour le sous-titre
   */
  subtitleClassName?: string

  /**
   * Styles inline personnalisés pour le sous-titre
   */
  subtitleStyle?: React.CSSProperties

  /**
   * Classes CSS personnalisées pour l'image
   */
  imageClassName?: string

  /**
   * Styles inline personnalisés pour l'image
   */
  imageStyle?: React.CSSProperties

  /**
   * Classes CSS personnalisées pour le conteneur des mots-clés
   */
  keywordsClassName?: string

  /**
   * Classes CSS personnalisées pour chaque mot-clé (badge)
   */
  keywordClassName?: string

  /**
   * Classes CSS personnalisées pour le conteneur du contenu textuel
   */
  contentClassName?: string
}

/**
 * Composant Card avancé permettant d'afficher du contenu structuré
 * avec titre, sous-titre, image et mots-clés.
 *
 * @example
 * ```tsx
 * <CardAdvanced
 *   title="Mon titre"
 *   subtitle="Mon sous-titre"
 *   image="https://example.com/image.jpg"
 *   keywords={["tag1", "tag2"]}
 *   imagePosition="left"
 * />
 * ```
 */
const CardAdvanced = React.forwardRef<HTMLDivElement, CardAdvancedProps>(
  (
    {
      title,
      subtitle,
      image,
      imageAlt,
      keywords,
      imagePosition = "top",
      titleClassName,
      titleStyle,
      subtitleClassName,
      subtitleStyle,
      imageClassName,
      imageStyle,
      keywordsClassName,
      keywordClassName,
      contentClassName,
      className,
      ...props
    },
    ref
  ) => {
    // Déterminer si on a une image
    const hasImage = Boolean(image)

    // Déterminer si on a du contenu textuel
    const hasTitle = Boolean(title)
    const hasSubtitle = Boolean(subtitle)
    const hasKeywords = Boolean(keywords && keywords.length > 0)
    const hasTextContent = hasTitle || hasSubtitle || hasKeywords

    // Styles par défaut pour le titre
    const defaultTitleClasses = "font-semibold leading-none tracking-tight text-card-foreground"

    // Styles par défaut pour le sous-titre
    const defaultSubtitleClasses = "text-sm text-muted-foreground"

    // Styles par défaut pour l'image
    const defaultImageClasses = "object-cover w-full h-full"

    // Rendu de l'image
    const renderImage = () => {
      if (!hasImage) return null

      const imageContainerClasses = cn(
        "flex-shrink-0",
        imagePosition === "top" && "w-full",
        (imagePosition === "left" || imagePosition === "right") && "w-1/3"
      )

      return (
        <div className={imageContainerClasses}>
          <img
            src={image}
            alt={imageAlt || title || "Card image"}
            className={cn(defaultImageClasses, imageClassName)}
            style={imageStyle}
          />
        </div>
      )
    }

    // Rendu du contenu textuel
    const renderTextContent = () => {
      if (!hasTextContent) return null

      const contentContainerClasses = cn(
        "flex flex-col space-y-2",
        (imagePosition === "left" || imagePosition === "right") && "flex-1",
        contentClassName
      )

      return (
        <div className={contentContainerClasses}>
          {hasTitle && (
            <h3
              className={cn(defaultTitleClasses, titleClassName)}
              style={titleStyle}
            >
              {title}
            </h3>
          )}

          {hasSubtitle && (
            <p
              className={cn(defaultSubtitleClasses, subtitleClassName)}
              style={subtitleStyle}
            >
              {subtitle}
            </p>
          )}

          {hasKeywords && (
            <div
              className={cn(
                "flex flex-wrap gap-2",
                keywordsClassName
              )}
            >
              {keywords!.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(keywordClassName)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )
    }

    // Déterminer les classes du conteneur principal selon la position de l'image
    const getContainerClasses = () => {
      if (!hasImage) {
        return "flex flex-col"
      }
      
      if (imagePosition === "top") {
        return "flex flex-col gap-4"
      }
      
      if (imagePosition === "left" || imagePosition === "right") {
        return "flex flex-row gap-4"
      }
      
      return "flex flex-col gap-4"
    }

    return (
      <Card ref={ref} className={className} {...props}>
        <CardContent className={cn("p-6", getContainerClasses())}>
          {hasImage && imagePosition === "top" && (
            <>
              {renderImage()}
              {renderTextContent()}
            </>
          )}

          {hasImage && imagePosition === "left" && (
            <>
              {renderImage()}
              {renderTextContent()}
            </>
          )}

          {hasImage && imagePosition === "right" && (
            <>
              {renderTextContent()}
              {renderImage()}
            </>
          )}

          {!hasImage && renderTextContent()}
        </CardContent>
      </Card>
    )
  }
)

CardAdvanced.displayName = "CardAdvanced"

export { CardAdvanced }

