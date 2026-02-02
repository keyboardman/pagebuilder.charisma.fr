import { type ButtonHTMLAttributes } from "react";

const Button = ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            {...props}
            className="bg-blue-600 text-white rounded-xs p-0.5 m-0.5"
        >{children}</button>
    )
}

export default Button;