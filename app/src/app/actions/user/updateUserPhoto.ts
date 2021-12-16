export const UPDATE_USER_PHOTO = 'UPDATE_USER_PHOTO';
export const updateUserPhoto = (photo: string) => {
    return {
        type: UPDATE_USER_PHOTO,
        payload: photo,
    }
};
