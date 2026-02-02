const EditHasLink = ({ link, children }: { link: string, children: React.ReactNode }) => {
    const preventNavigation: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();
    };

    if (!link) return children;

    return (
        <a href={link} className="block w-full" onClick={preventNavigation}>
            {children}
        </a>
    )
}

export default EditHasLink;