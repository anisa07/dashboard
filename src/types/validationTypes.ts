export interface ValidationResult {
    error: boolean;
    errorMessage: string;
}

export type ValidationArgs = string | number | boolean | Date;

export interface FormValidationFunction {
    (value: ValidationArgs, form?: FormDataType): ValidationResult;
}

export interface FormDataElement {
    value: string;
    error: boolean;
    errorMessage: string;
    validation: Array<FormValidationFunction>;
}

export interface FormDataType {
    [key: string]: FormDataElement;
}
