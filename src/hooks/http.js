import {useReducer, useCallback} from 'react';
const initialState =  {
    loading: false,
    error: null,
    data: null,
    extra: null,
    indentifier: null
};
const httpStateReducer = (curHttpState, action) => {
    switch(action.type) {
      case 'SEND':
        return {loading: true, error: null, data: null, extra: null, indentifier: action.reqIndentifier}
      case 'RESPONSE':
        return {...curHttpState, loading: false, data: action.responseData, extra: action.reqExtra}
      case 'ERROR':
        return {loading: false, error: action.errorMessage}
      case 'CLEAR':
        return initialState;
      default:
        throw new Error('Shoud not be reached! ')
    }
}
const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpStateReducer, initialState);
    const sendRequest = useCallback((url, method, body, reqExtra, reqIndentifier) => {
        dispatchHttp({type: 'SEND', reqIndentifier: reqIndentifier});
        fetch(url, {
            method: method,
            body: body
        }).then(response => {
            return response.json();
        }).then(responseData => {
            console.log()
            dispatchHttp({type: 'RESPONSE', responseData: responseData, reqExtra: reqExtra});
        })
        .catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: error.message});
        })

        }, []);

    const clear = useCallback(() => {
        dispatchHttp({type: 'CLEAR'});
    },[])
    return {
        isLoading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIndentifier: httpState.indentifier,
        clear: clear
    }
}
export default useHttp;