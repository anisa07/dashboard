import {Button, Flex, Box, Text} from "@chakra-ui/react"
import {useFormCustomHook} from "../hooks/useFormHook";
import {FormDataType} from "../types/validationTypes";
import {ensureEmail, ensureNotEmpty} from "../rules/validation";
import {colors} from "../styles/themes";
import {FormEvent, useEffect} from "react";
import {FormInput} from "../components/FormInput";
import {useNavigate, Link} from "react-router-dom";
import {getUserFromSessionStorage} from "../services/sessionService";
import {login} from "../services/authService";
import {useAlert} from "../hooks/useAlert";
import {getErrorMessage} from "../helpers/helperFunc";

export const Login = () => {
    const { openAlert } = useAlert();

    const formData: FormDataType = {
        email: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty, ensureEmail]
        },
        password: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        },
    };
    const { onChange, isValid, form, cleanFormData } = useFormCustomHook({...formData});
    const navigate = useNavigate();

    useEffect(() => {
        if (getUserFromSessionStorage()) {
            navigate("/");
        }
    }, []);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login({
                email: form.email.value,
                password: form.password.value,
            });
            cleanFormData();
            navigate("/")
        } catch (e: unknown) {
            openAlert(getErrorMessage(e), 'error');
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
                    formElement={form.password}
                    label="Password"
                    name="password"
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
                    <Link to="/signup">No account? Just signup!</Link>
                </Flex>
            </form>
        </Box>
    )
}
