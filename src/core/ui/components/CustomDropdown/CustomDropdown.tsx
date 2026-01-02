import { Dropdown, IDropdownOption, Spinner } from "@fluentui/react";
import * as React from "react";
import { Text, ITextProps } from '@fluentui/react/lib/Text';
import styles from "./CustomDropdown.module.scss";

interface CustomDropdownProps {
    label: string;
    required?: boolean;
    options: IDropdownOption[];
    selectedKey?: string | number | null;
    errorMessage?: string;
    onChange?: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => void;
    placeholder?: string;
    isLoading?: boolean;
    disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    label,
    required = false,
    options,
    selectedKey = null,
    errorMessage = "",
    onChange,
    placeholder = "",
    isLoading = false,
    disabled = false,
}) => {
    return (
        <div className={styles.container}>
            {isLoading &&
                <div className={styles.spinner}>
                    <Spinner />
                </div>
            }
            <Dropdown
                label={label}
                required={required}
                options={options}
                placeholder={placeholder}
                selectedKey={selectedKey}
                onChange={(e, option) => {
                    if (onChange)
                        onChange(e, option);
                }}
                errorMessage={errorMessage}
                disabled={isLoading || options.length === 0 || disabled}
            />
            {!isLoading && options.length === 0 && (
                <Text className={styles.text}>
                    No hay opciones disponibles.
                </Text>
            )}
        </div>
    );
}

export default CustomDropdown;