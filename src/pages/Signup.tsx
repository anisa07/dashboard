import {Button, Flex, Box, Text, useDisclosure} from "@chakra-ui/react"
import {useFormCustomHook} from "../hooks/useFormHook";
import {FormDataType} from "../types/validationTypes";
import {ensureEmail, ensureNotEmpty, ensurePasswordsAreEqual} from "../rules/validation";
import {colors} from "../styles/themes";
import {FormEvent, useEffect, useState} from "react";
import {FormInput} from "../components/FormInput";
import {useNavigate, Link} from "react-router-dom";
import {getUserFromSessionStorage} from "../services/sessionService";
import {signup} from "../services/authService";
import {AlertMessage} from "../components/AlertMessage";

export const Signup = () => {
    const {
        isOpen,
        onClose,
        onOpen
    } = useDisclosure({ defaultIsOpen: false })

    const formData: FormDataType = {
        email: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty, ensureEmail]
        },
        name: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        },
        password: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        },
        newPassword: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty, ensurePasswordsAreEqual]
        },
    };
    const { onChange, isValid, form, cleanFormData } = useFormCustomHook({...formData});
    const navigate = useNavigate();
    const [serviceError, setServiceError] = useState('');

    useEffect(() => {
        if (getUserFromSessionStorage()) {
            navigate("/");
        }
    }, []);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await signup({
                email: form.email.value,
                name: form.name.value,
                password: form.password.value,
            });
            cleanFormData();
            navigate("/")
        } catch (e: any) {
            setServiceError(e.message);
            onOpen()
        }
    }

    return (
        <Box sx={{ width: {'base': '90%', md: 500}, mx: 'auto', my: 5 }}>
            <form>
                <Text mb={1} fontWeight="bold" fontSize="md" textTransform="capitalize">Login</Text>
                <FormInput
                    formElement={form.email}
                    label="Email"
                    name="email"
                    type="email"
                    onChange={onChange}
                />
                <FormInput
                    formElement={form.name}
                    label="Name"
                    name="name"
                    type="text"
                    onChange={onChange}
                />
                <FormInput
                    formElement={form.password}
                    label="Password"
                    name="password"
                    type="password"
                    onChange={onChange}
                />
                <FormInput
                    formElement={form.newPassword}
                    label="Repeat Password"
                    name="newPassword"
                    type="password"
                    onChange={onChange}
                />
                <Flex alignItems="center" justifyContent="space-between" mt={4}>
                    <Button
                        disabled={!isValid()}
                        sx={{
                            textTransform: 'capitalize',
                            backgroundColor: colors.bright1,
                            color: colors.light1
                        }}
                        variant='solid' onClick={onSubmit}>
                        Submit
                    </Button>
                    <Link to="/login">Have an account? Just login!</Link>
                </Flex>
                <AlertMessage text={serviceError} status="error" isOpen={isOpen} onClose={onClose} />
            </form>
        </Box>
    )
}
