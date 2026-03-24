# STYLES par defaut

## style NODE-NAV

```css
.kbd-menu {
    kbd-menu-content {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 1rem;
    }
}

.kbd-menu-burger {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex: 1;
    justify-content: flex-end;
    min-width: 0;
    padding-left: 1rem;
    padding-right: 1rem;

    .kbd-menu-burger-item {
        display: block;
        font-family: sans-serif;
        font-weight: normal;
        font-size: 1rem;
        line-height: 1.25rem;
        width: 100%;
        padding: 0.25rem;
        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
            text-decoration: none;
        }
    }
}
```

## style NODE-NAV-ITEM

```css
.kbd-nav-item {
    
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-weight: normal;
    font-size: 1rem;
    line-height: 1.25rem;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        text-decoration: none;
    }
}
```
