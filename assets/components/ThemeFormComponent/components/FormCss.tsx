import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import ColorSwatch from './ColorSwatch';

const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => {
    return (
        <label htmlFor={htmlFor} className="text-sm font-medium">
            {children}
        </label>
    )
};

const Group = ({ children, htmlFor, label }: { children: React.ReactNode, htmlFor: string, label: string }) => {
    return (
        <div className="space-y-1">
            <Label htmlFor={htmlFor} >{label}</Label>
            {children}
        </div>
    );
}

const FormInput = ({ id, value, onChange, placeholder, type, name, children }: { id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void, placeholder?: string, type: string, children?: React.ReactNode, name?: string }) => {
    switch (type) {
        case 'color':
            return (
                <InputGroup>
                    <InputGroupAddon align="inline-start">
                        <ColorSwatch value={value} prop="color" />
                    </InputGroupAddon>
                    <InputGroupInput id={id} type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} className="px-3 py-1 m-0 text-sm leading-none" />
                </InputGroup>
            );
        case 'background-color':
            return (
                <InputGroup>
                    <InputGroupAddon align="inline-start">
                        <ColorSwatch value={value} prop="background" />
                    </InputGroupAddon>
                    <InputGroupInput id={id} type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} className="px-3 py-1 m-0 text-sm leading-none" />
                </InputGroup>
            );
        case 'select':
            return (
                <select
                    id={id}
                    name={name}
                    className="input input-bordered w-full px-3 py-1 m-0 text-sm leading-none"
                    value={value}
                    onChange={onChange}
                >
                    {children}
                </select>
            );

        case 'text':
        default:
            return (
                <input
                    id={id}
                    name={name}
                    type="text"
                    className="input input-bordered w-full px-3 py-1 m-0 text-sm leading-none"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            );
    }
}

export default ({id, value, onChange, placeholder, type, label, children, name}: {id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void, placeholder?: string, type: string, label: string, children?: React.ReactNode, name?: string}) => (
    <Group htmlFor={id} label={label}>
        <FormInput id={id} value={value} onChange={onChange} placeholder={placeholder} type={type} name={name}>{children}</FormInput>
    </Group>
);