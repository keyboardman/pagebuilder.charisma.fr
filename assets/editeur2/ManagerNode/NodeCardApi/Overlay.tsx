export const OverlayWrapper = ( { children }: { children: React.ReactNode } ) => {
    return (
        <div className="relative w-full overflow-hidden">
            {children}
        </div>
    )
}

export const OverlayContent = ( { children, style }: { children: React.ReactNode, style: React.CSSProperties } ) => {
    return <div className="absolute px-4 py-3 z-10 w-full bottom-0 left-0 right-0" style={style} >{children}</div>
}