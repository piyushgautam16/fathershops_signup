
let initial = {
    error: null,
    data: null
}

export const authReducer = (data: any, action: any) => {
    switch (action.type) {
        case "SIGNUP_SUCCESS":
            return { ...initial, data: action.payload }
        case "SIGNUP_FAILURE":
            alert(action.error)
            return { error: action.error, data: null }
        default:
            return initial
    }
}