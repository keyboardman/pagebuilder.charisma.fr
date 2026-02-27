const HasLink = ({ link, children }: { link: string, children: React.ReactNode }) => {

    if (!link) return children;

    return (
        <a href={link} className="block w-full" target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    )
}

export default HasLink;