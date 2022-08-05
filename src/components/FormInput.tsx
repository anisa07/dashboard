import {FormControl, FormHelperText, FormLabel, Input} from "@chakra-ui/react";

export const FormInput = ({formElement, name, label, type,  onChange}: any) => {
    const { value, error, errorMessage } = formElement;

    return <FormControl my={4}>
        <FormLabel>{label}</FormLabel>
        <Input type={type} name={name} value={value} onChange={onChange} />
        {error && <FormHelperText sx={{ color: 'red' }}>{errorMessage}</FormHelperText>}
    </FormControl>
}
