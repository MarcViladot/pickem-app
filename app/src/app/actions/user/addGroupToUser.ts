import {Group} from '../../interfaces/user.interface';

export const ADD_GROUP_TO_USER = 'ADD_GROUP_TO_USER';
export const addGroupToUser = (group: Group) => {
    return {
        type: ADD_GROUP_TO_USER,
        payload: group,
    }
};
