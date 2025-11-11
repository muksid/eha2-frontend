import * as Yup from 'yup'

export const schema = Yup.object().shape({
    login: Yup.string()
        .trim()
        .required('Product Title Required'),
    password: Yup.string().trim()
        .required('Product Title Required'),
})

export const signUpSchema = Yup.object().shape({
    password: Yup.string().trim()
        .required('Password Required'),
    name: Yup.string().trim()
        .required('Username Required'),
    email: Yup.string().trim()
        .required('Email Required'),
    repeatPassword: Yup.string().trim()
        .required('Repeat password Required'),
})
