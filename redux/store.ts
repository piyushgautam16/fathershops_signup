
import rootReducer from './rootReducer';
import createSagaMiddleware from 'redux-saga';
import authSaga from './sagas/authSaga';
import { configureStore } from '@reduxjs/toolkit';

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
});

sagaMiddleware.run(authSaga);

export default store;