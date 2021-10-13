import {AnyAction} from 'redux';

const initialState = {
    modalType: null,
    modalProps: {}
};

export default (state = initialState, action: AnyAction) => {
    if (action.type === "OPEN_MODAL") {
        return {
            ...state,
            modalType: action.payload.type,
            modalProps: action.payload.props
        };
    }
    else if (action.type === "CLOSE_MODAL") {
        return {
            ...state,
            modalType: '',
            modalProps: {}
        };
    }
    return state;
};
