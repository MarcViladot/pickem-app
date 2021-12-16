import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SettingsStackParamList} from './SettingsScreen';
import {RouteProp} from '@react-navigation/native';
import UserImage from '../common/UserImage';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {StyledButton} from '../common/StyledButton';
import user from '../../reducers/user';
import {logout} from '../../actions/auth/logout';
import styled from 'styled-components/native';
import CheckBox from '@react-native-community/checkbox';
import {format} from 'date-fns';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '../../api/auth';
import {showApiErrorToast} from '../../actions/utils/showApiErrorToast';
import {updateUserPhoto} from '../../actions/user/updateUserPhoto';
import Modal from 'react-native-modal'
import {User} from '../../interfaces/user.interface';

type ScreenNavigationProps = StackNavigationProp<SettingsStackParamList, "SettingsList">;
type ScreenRouteProp = RouteProp<SettingsStackParamList, "SettingsList">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

interface UserInfoProps {
    currentUser: User;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const SettingsListScreen: FC<Props> = ({route, navigation}) => {

    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const [darkMode, setDarkMode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const TextButton = styled.TouchableOpacity<{ margin?: boolean }>`
      margin-bottom: ${props => props.margin ? '18px' : '0px'};
    `;

    const ButtonText = styled.Text`
      font-size: 16px;
      color: #000;
    `

    return (
        <View style={{padding: 10, flexGrow: 1}}>
            <UserInfo currentUser={currentUser} loading={loading} setLoading={setLoading}/>
            <View style={styles.settingsContainer}>
                <TextButton onPress={() => null} margin>
                    <ButtonText>Notifications</ButtonText>
                </TextButton>
                <TextButton onPress={() => null} margin>
                    <ButtonText>Language</ButtonText>
                </TextButton>
                <View style={{
                    marginBottom: 18,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <ButtonText>Dark mode</ButtonText>
                    <CheckBox
                        disabled={false}
                        value={darkMode}
                        onValueChange={(newValue) => setDarkMode(newValue)}
                    />
                </View>
                <TextButton onPress={() => null} margin>
                    <ButtonText>Terms and Conditions</ButtonText>
                </TextButton>
                <TextButton onPress={() => null}>
                    <ButtonText>Privacy Policy</ButtonText>
                </TextButton>
            </View>
            <TouchableOpacity style={styles.settingsContainer} onPress={() => dispatch(logout())}>
                <ButtonText>Sign out</ButtonText>
            </TouchableOpacity>
            <View style={{flexGrow: 1}}/>
            <View style={styles.settingsContainer}>
                <TouchableOpacity activeOpacity={.5}>
                    <Text style={{color: '#FF1E44', fontSize: 17, marginBottom: 3}}>Delete account forever</Text>
                </TouchableOpacity>
                <Text style={{color: 'gray', fontSize: 14}}>You are going to loose all your leagues. This action is
                    irreversible</Text>
            </View>
        </View>
    );
};

const UserInfo: FC<UserInfoProps> = ({currentUser, loading, setLoading}) => {

    const dispatch = useDispatch();
    const [cameraModalVisible, setCameraModalVisible] = React.useState(false);
    const [photoUri, setPhotoUri] = React.useState('');

    const openCamera = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            quality: 0,
            cameraType: 'front',
        });
        try {
            setPhotoUri(result.assets[0].uri)
        } catch (e) {
        }
    }

    const selectPhoto = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0
        });
        try {
            setPhotoUri(result.assets[0].uri)
        } catch (e) {
        }
    }

    const updatePhoto = async () => {
        const res = await auth.updateUserPhoto(photoUri);
        if (!res.IsError) {
            dispatch(updateUserPhoto(res.Result));
            closeModal();
        } else {
            dispatch(showApiErrorToast(res));
        }
    }

    const removePhoto = async () => {
        const res = await auth.removeUserPhoto();
        if (!res.IsError) {
            dispatch(updateUserPhoto(''));
        } else {
            dispatch(showApiErrorToast(res));
        }
    }

    const closeModal = () => {
        setCameraModalVisible(false)
        setPhotoUri('');
    }

    return (
        <>
            <Modal isVisible={cameraModalVisible} style={{
                margin: 0,
                flex: 1,
                justifyContent: 'flex-end',
            }}
                   onBackdropPress={() => closeModal()}
                   onBackButtonPress={() => closeModal()}
                   animationIn="slideInUp"
                   animationOut={'fadeOut'}>
                <View style={styles.bottomModal}>
                    {!photoUri ? (
                            <View style={[styles.buttonsRow, {marginBottom: 20}]}>
                                <StyledButton color={'primary'} style={styles.button} disabled={loading}
                                              onPress={() => openCamera()}>
                                    <Text style={styles.buttonText}>Take photo</Text>
                                </StyledButton>
                                <StyledButton color={'primary'} style={styles.button} disabled={loading}
                                              onPress={() => selectPhoto()}>
                                    <Text style={styles.buttonText}>Select photo</Text>
                                </StyledButton>
                            </View>
                        )
                        : (
                            <View>
                                <Image style={[styles.profileImage, {marginTop: 20}]}
                                       source={{uri: photoUri}}/>
                                <View style={[styles.buttonsRow, {marginBottom: 20}]}>
                                    <StyledButton color={'cancel'} style={styles.button} disabled={loading}
                                                  onPress={() => closeModal()}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </StyledButton>
                                    <StyledButton color={'primary'} style={styles.button} disabled={loading}
                                                  onPress={() => updatePhoto()}>
                                        <Text style={styles.buttonText}>Confirm</Text>
                                    </StyledButton>
                                </View>
                            </View>
                        )
                    }
                </View>
            </Modal>
            <View style={[styles.settingsContainer, {paddingVertical: 15}]}>
                <UserImage user={currentUser} styles={styles.profileImage}/>
                <View style={styles.buttonsRow}>
                    <StyledButton color={'warn'} disabled={!currentUser.photo} style={styles.button} onPress={() => removePhoto()}>
                        <Text style={styles.buttonText}>Remove photo</Text>
                    </StyledButton>
                    <StyledButton color={'primary'} disabled={loading} onPress={() => setCameraModalVisible(true)}
                                  style={styles.button}>
                        <Text style={styles.buttonText}>New photo</Text>
                    </StyledButton>
                </View>
                <View style={styles.userBottomInfo}>
                    <Text style={{fontSize: 18, color: '#000', marginBottom: 3}}>{currentUser.name}</Text>
                    <Text style={{fontSize: 15, color: 'gray'}}>Registered
                        on {format(new Date(currentUser.createdAt), 'dd/MM/yyyy')}</Text>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    settingsContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10
    },
    profileImage: {
        height: 85,
        width: 85,
        borderRadius: 50,
        alignSelf: 'center'
    },
    buttonsRow: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: '49%'
    },
    buttonText: {
        fontSize: 16,
        color: '#fff'
    },
    userBottomInfo: {
        marginTop: 20,
    },
    userBottomInfoText: {},
    bottomModal: {
        padding: 10,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 0
    }
})

export default SettingsListScreen;
