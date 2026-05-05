const HasLink = ({ link, children }: { link: string, children: React.ReactNode }) => {

    if (!link) return children;

    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="ce-card-link">
            {children}
        </a>
    )
}

export default HasLink;