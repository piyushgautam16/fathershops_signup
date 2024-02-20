
export const signUpAction = (payload: {
    name: string,
    email: string,
    password: string,
    phone: string
}) => {
    return {
        type: 'SIGNUP_USER',
        payload
    }
}

export const signUpSuccess = (payload: any) => {
    return {
        type: 'SIGNUP_SUCCESS',
        payload
    }
}

export const signUpFailure = (payload: any) => {
    return {
        type: 'SIGNUP_FAILURE',
        payload
    }
}