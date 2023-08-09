import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  username: yup.string().required("Veuillez insérer un identifiant!"),
  email: yup.string().email("email invalide").required("required"),
  password: yup.string().required("Veuillez inserer un mot de passe!"),
  address: yup.string().required("required"),
  contact: yup.string().required("required"),
  domain: yup.string().required("required"),
  products: yup.string().required("required"),
  prices: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  username: "",
  email: "",
  password: "",
  address: "",
  contact: "",
  domain: "",
  products: "",
  prices: "",
};

const initialValuesLogin = {
  username: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedSupplierResponse = await fetch(
      "http://localhost:8000/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedSupplier = await savedSupplierResponse.json();
    onSubmitProps.resetForm();

    if (savedSupplier) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:8000/auth/loginBuyer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          buyer: loggedIn.buyer,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
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
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
                  label="Identifiant"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Mot de passe"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />

            {isRegister && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Adresse"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  name="address"
                  error={
                    Boolean(touched.address) && Boolean(errors.address)
                  }
                  helperText={touched.address && errors.address}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Contact"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact}
                  name="contact"
                  error={
                    Boolean(touched.contact) && Boolean(errors.contact)
                  }
                  helperText={touched.contact && errors.contact}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Domaine d'activité"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.domain}
                  name="domain"
                  error={
                    Boolean(touched.domain) && Boolean(errors.domain)
                  }
                  helperText={touched.domain && errors.domain}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Produits proposés"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.products}
                  name="products"
                  error={
                    Boolean(touched.products) && Boolean(errors.products)
                  }
                  helperText={touched.products && errors.products}
                  multiline // Use multiline for textarea
                  rows={3} // Specify the number of rows
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Prix des produits"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.prices}
                  name="prices"
                  error={
                    Boolean(touched.prices) && Boolean(errors.prices)
                  }
                  helperText={touched.prices && errors.prices}
                  multiline // Use multiline for textarea
                  rows={3} // Specify the number of rows
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            )}

            
          </Box>

          {/* BUTTONS */}
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
  );
};

export default Form;