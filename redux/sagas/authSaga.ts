import { call, put, takeEvery } from "redux-saga/effects";

function* signUpUser(action: {
    type: string,
    payload: {
        name: string,
        email: string,
        password: string,
        phone: string
    }
}) {
    try {
        const response: Response = yield call(fetch, '/api/signup', {
            method: 'POST',
            body: JSON.stringify(action.payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status == 201) {
            // @ts-ignore 
            const data: any = yield response.json();
            yield put({ type: 'SIGNUP_SUCCESS', payload: data });
        }
        else {
            yield put({ type: 'SIGNUP_FAILURE', error: response.statusText });
        }
    } catch (error: any) {
        yield put({ type: 'SIGNUP_FAILURE', error: error.message });
    }
}
function* authSaga() {
    yield takeEvery('SIGNUP_USER', signUpUser)
}

export default authSaga;