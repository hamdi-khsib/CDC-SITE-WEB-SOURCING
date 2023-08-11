import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import PulseLoader from 'react-spinners/PulseLoader'
import { Formik } from "formik";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
  } from "@mui/material";

const Login = () => {

    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const isLogin = pageType === "login";
    const isRegister = pageType === "register";


    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])


    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/home')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus(); 
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <PulseLoader color={"#FFF"} />

    const content = (
        <Formik onSubmit={handleFormSubmit}>
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}>
                        <TextField
                            label="Identifiant"
                            onBlur={handleBlur}
                            onChange={handleUserInput}
                            value={username}
                            name="username"
                            error={Boolean(touched.username) && Boolean(errors.username)}
                            helperText={touched.username && errors.username}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Mot de passe"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handlePwdInput}
                            value={password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>
                    <Box>
                        <Button
                        fullWidth
                        type="submit"
                        sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: palette.primary.main,
                            color: palette.background.alt,
                            "&:hover": { color: palette.primary.main },
                        }}
                        >
                        {isLogin ? "Se connecter" : "S'inscrire"}
                        </Button>
                        <Typography
                        onClick={() => {
                            setPageType(isLogin ? "register" : "login");
                            resetForm();
                        }}
                        sx={{
                            textDecoration: "underline",
                            color: palette.primary.main,
                            "&:hover": {
                            cursor: "pointer",
                            color: palette.primary.light,
                            },
                        }}
                        >
                        {isLogin
                            ? "Vous n'avez pas de compte ? Inscrivez-vous ici."
                            : "Vous avez déjà un compte? Connectez-vous ici."}
                        </Typography>
                    </Box>
                </form>
            
            )}
        </Formik>
    )

    return content
}
export default Login