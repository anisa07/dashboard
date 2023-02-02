import {FormControl, FormHelperText, FormLabel, Input} from "@chakra-ui/react";
import {FormDataElement} from "../types/validationTypes";
import {ChangeEvent} from "react";

interface FormInputProps {
    formElement: FormDataElement,
    name: string,
    label: string,
    type: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const FormInput = ({formElement, name, label, type, onChange}: FormInputProps) => {
    const { value, error, errorMessage } = formElement;

    return <FormControl my={4}>
        <FormLabel>{label}</FormLabel>
        <Input type={type} name={name} value={value} onChange={onChange} />
        {error && <FormHelperText sx={{ color: 'red' }}>{errorMessage}</FormHelperText>}
    </FormControl>
}
