import React from 'react';

const Label = ({htmlFor, children}: { htmlFor: string, children: React.ReactNode }) => {
    return (
        <label htmlFor={htmlFor} className="text-sm font-medium">
            {children}
        </label>
    )
};

export default Label;