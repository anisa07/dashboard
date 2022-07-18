import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import {FormDataElement, ValidationResult, FormDataType} from "../types/validationTypes";

export function useFormCustomHook(formData: FormDataType) {
    const [form, setForm] = useState(formData);
    const [errorsMap, setErrorsMap] = useState(new Map());

    const validateFunc = (inputField: FormDataElement): ValidationResult => {
        for (const validate of inputField.validation) {
            const validationResult = validate(inputField.value, form);
            if (validationResult.error) {
                return validationResult;
            }
        }
        return {
            error: false,
            errorMessage: ''
        };
    };

    const fillErrorsMap = (data: FormDataType) => {
        const newErrorsMap = new Map();
        Object.entries(data).forEach(([fieldName, field]) => {
            const validationResult = validateFunc(field);
            if (validationResult.error) {
                newErrorsMap.set(fieldName, true);
            }
        });
        setErrorsMap(newErrorsMap);
    };

    useEffect(() => {
        fillErrorsMap(formData);
    }, []);

    const validateField = useCallback((inputField: FormDataElement) => validateFunc(inputField), [form]);

    const onChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            const inputObj = { ...form[name] };
            inputObj.value = value;
            const isValidInput = validateField(inputObj);
            inputObj.error = isValidInput.error;
            inputObj.errorMessage = isValidInput.errorMessage;

            const mapHasError = errorsMap.has(name);
            if (mapHasError !== inputObj.error) {
                const newErrorsMap = new Map(errorsMap);
                inputObj.error ? newErrorsMap.set(name, true) : newErrorsMap.delete(name);
                setErrorsMap(newErrorsMap);
            }

            setForm({ ...form, [name]: inputObj });
        },
        [form, validateField, errorsMap]
    );

    const isValid = useCallback(() => {
        return !errorsMap.size;
    }, [errorsMap]);

    const resetFormData = (data: FormDataType) => {
        setForm(data);
        fillErrorsMap(data);
    };

    const cleanFormData = () => {
        const newForm = {...form};
        for (let field in newForm) {
            newForm[field].value = "";
            newForm[field].error = false;
            newForm[field].errorMessage = "";
        }
        setForm(newForm);
        fillErrorsMap(newForm);
    };

    return { onChange, isValid, form, resetFormData, cleanFormData };
}
