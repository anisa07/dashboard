import {ValidationArgs, ValidationResult, FormDataType} from "../types/validationTypes";
import {EMAIL_W3C, MAX_LENGTH} from "./regex";

function returnValidationResult(errorCondition: boolean, errorMessage: string): ValidationResult {
    if (errorCondition) {
        return {
            error: true,
            errorMessage: errorMessage
        };
    }
    return {
        error: false,
        errorMessage: ''
    };
}

export function ensureNotEmpty(value: ValidationArgs): ValidationResult {
    return returnValidationResult((value as string).length === 0, 'Required');
}

export function ensureNotTooShortPassword(value: ValidationArgs): ValidationResult {
    return returnValidationResult((value as string).length < 6, 'Required length is at least 6');
}

export function ensureMaxLength(value: ValidationArgs): ValidationResult {
    return returnValidationResult((value as string).length > MAX_LENGTH, 'Description is too long');
}

export function ensureEmail(value: ValidationArgs): ValidationResult {
    const isEmailFormat = (value as string).toLowerCase().match(EMAIL_W3C);
    return returnValidationResult(!isEmailFormat, 'Email is invalid');
}

export function ensurePasswordsAreEqual(value: ValidationArgs, form?: FormDataType): ValidationResult {
    return returnValidationResult(value !== form?.password.value, 'Passwords are not equal');
}
