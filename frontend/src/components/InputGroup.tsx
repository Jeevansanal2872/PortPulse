import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputGroupProps {
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: LucideIcon;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, type = "text", placeholder, value, onChange, icon: Icon }) => {
    return (
        <div className="mb-6">
            <label className="block text-gray-500 text-sm font-bold mb-2 ml-1">
                {label}
            </label>
            <div className="neumorphic-inset flex items-center px-4 py-3">
                {Icon && <Icon className="text-gray-400 mr-3 w-5 h-5" />}
                <input
                    type={type}
                    placeholder={placeholder}
                    className="bg-transparent border-none w-full text-gray-700 leading-tight focus:outline-none focus:ring-0"
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default InputGroup;
