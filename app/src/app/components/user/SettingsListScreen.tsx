import React, {FC, useEffect, useState} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SettingsStackParamList} from './SettingsScreen';
import {RouteProp, useTheme} from '@react-navigation/native';
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
import {ThemeContext} from '../../../../themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeView} from '../common/ThemeView';
import {useTranslation} from 'react-i18next';
import {Picker} from '@react-native-picker/picker';
import {ThemeText} from '../common/ThemeText';
import {setLanguage} from '../../actions/utils/setLanguage';

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

interface LanguageModalProps {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
}

const SettingsListScreen: FC<Props> = ({route, navigation}) => {

    const {t} = useTranslation()
    const {setTheme, theme} = React.useContext(ThemeContext);
    const {colors} = useTheme();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const [loading, setLoading] = React.useState(false);
    const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

    const changeTheme = async (newTheme: string) => {
        await AsyncStorage.setItem('pickem_theme', newTheme);
        setTheme(newTheme);
    }

    const TextButton = styled.TouchableOpacity<{ margin?: boolean }>`
      margin-bottom: ${props => props.margin ? '18px' : '0px'};
    `;

    const ButtonText = styled.Text`
      font-size: 16px;
      color: ${colors.text};
    `

    return (
        <View style={{padding: 10, flexGrow: 1}}>
            <LanguageModal isVisible={isLanguageModalVisible} setIsVisible={setIsLanguageModalVisible}/>
            <UserInfo currentUser={currentUser} loading={loading} setLoading={setLoading}/>
            <ThemeView style={styles.settingsContainer}>
                <TextButton onPress={() => null} margin>
                    <ButtonText>{t('SETTINGS.NOTIFICATIONS')}</ButtonText>
                </TextButton>
                <TextButton onPress={() => setIsLanguageModalVisible(true)} margin>
                    <ButtonText>{t('SETTINGS.LANGUAGE')}</ButtonText>
                </TextButton>
                <View style={{
                    marginBottom: 18,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <ButtonText>{t('SETTINGS.DARK_MODE')}</ButtonText>
                    <CheckBox
                        disabled={false}
                        value={theme === 'dark'}
                        onValueChange={(newValue) => {
                            changeTheme(newValue ? 'dark' : 'light')
                        }}
                    />
                </View>
                <TextButton onPress={() => null} margin>
                    <ButtonText>{t('SETTINGS.TERMS_AND_CONDITIONS')}</ButtonText>
                </TextButton>
                <TextButton onPress={() => null}>
                    <ButtonText>{t('SETTINGS.PRIVACY_POLICY')}</ButtonText>
                </TextButton>
            </ThemeView>
            <TouchableOpacity style={[styles.settingsContainer, {backgroundColor: colors.card}]}
                              onPress={() => dispatch(logout())}>
                <ButtonText>{t('SETTINGS.SIGN_OUT')}</ButtonText>
            </TouchableOpacity>
            <View style={{flexGrow: 1}}/>
            <ThemeView style={styles.settingsContainer}>
                <TouchableOpacity activeOpacity={.5}>
                    <Text
                        style={{color: '#FF1E44', fontSize: 17, marginBottom: 3}}>{t('SETTINGS.DELETE_ACCOUNT')}</Text>
                </TouchableOpacity>
                <Text style={{color: 'gray', fontSize: 14}}>{t('SETTINGS.DELETE_ACCOUNT_DESC')}</Text>
            </ThemeView>
        </View>
    );
};

const LanguageModal: FC<LanguageModalProps> = ({isVisible, setIsVisible}) => {

    const {t, i18n} = useTranslation();
    const {colors} = useTheme();
    const dispatch = useDispatch();
    const currentLang = useSelector((state: RootState) => state.utils.currentLang);

    const closeModal = () => {
        setIsVisible(false);
    }

    const selectLanguage = async (lang: string) => {
        await AsyncStorage.setItem('pickem_lang', lang);
        dispatch(setLanguage(lang));
        await i18n.changeLanguage(lang)
        setIsVisible(false);
    }

    return (
        <Modal isVisible={isVisible} style={{
            margin: 0,
            flex: 1,
            justifyContent: 'flex-end',
        }}
               onBackdropPress={() => closeModal()}
               onBackButtonPress={() => closeModal()}
               animationIn="slideInUp"
               animationOut={'fadeOut'}>
            <ThemeView style={[styles.bottomModal, {padding: 20}]}>
                <ThemeText style={{textAlign: 'center', fontSize: 20}}>{t('SETTINGS.SELECT_LANGUAGE')}</ThemeText>
                <Picker
                    style={Platform.OS === 'ios' ? styles.iosPicker : {color: colors.text}}
                    itemStyle={{color: colors.text}}
                    selectedValue={currentLang}
                    onValueChange={(itemValue, itemIndex) => {
                        selectLanguage(itemValue);
                    }}>
                    <Picker.Item label={t('COMMON.ENGLISH')} value="en"/>
                    <Picker.Item label={t('COMMON.SPANISH')} value="es"/>
                </Picker>
            </ThemeView>
        </Modal>
    )
}

const UserInfo: FC<UserInfoProps> = ({currentUser, loading, setLoading}) => {

    const {t} = useTranslation();
    const {colors} = useTheme();
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
                <ThemeView style={styles.bottomModal}>
                    {!photoUri ? (
                            <View style={[styles.buttonsRow, {marginBottom: 20}]}>
                                <StyledButton color={'primary'} style={styles.button} disabled={loading}
                                              onPress={() => openCamera()}>
                                    <Text style={styles.buttonText}>{t('SETTINGS.TAKE_PHOTO')}</Text>
                                </StyledButton>
                                <StyledButton color={'primary'} style={styles.button} disabled={loading}
                                              onPress={() => selectPhoto()}>
                                    <Text style={styles.buttonText}>{t('SETTINGS.SELECT_PHOTO')}</Text>
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
                                        <Text style={styles.buttonText}>{t('COMMONºº.CANCEL')}</Text>
                                    </StyledButton>
                                    <StyledButton color={'primary'} style={styles.button} disabled={loading}
                                                  onPress={() => updatePhoto()}>
                                        <Text style={styles.buttonText}>{t('COMMON.CONFIRM')}</Text>
                                    </StyledButton>
                                </View>
                            </View>
                        )
                    }
                </ThemeView>
            </Modal>
            <ThemeView style={[styles.settingsContainer, {paddingVertical: 15}]}>
                <UserImage user={currentUser} styles={styles.profileImage}/>
                <View style={styles.buttonsRow}>
                    <StyledButton color={'warn'} disabled={!currentUser.photo} style={styles.button}
                                  onPress={() => removePhoto()}>
                        <Text style={styles.buttonText}>{t('SETTINGS.REMOVE_PHOTO')}</Text>
                    </StyledButton>
                    <StyledButton color={'primary'} disabled={loading} onPress={() => setCameraModalVisible(true)}
                                  style={styles.button}>
                        <Text style={styles.buttonText}>{t('SETTINGS.NEW_PHOTO')}</Text>
                    </StyledButton>
                </View>
                <View style={styles.userBottomInfo}>
                    <Text style={{fontSize: 18, color: colors.text, marginBottom: 3}}>{currentUser.name}</Text>
                    <Text style={{
                        fontSize: 15,
                        color: 'gray'
                    }}>{t('SETTINGS.REGISTERED_ON')} {format(new Date(currentUser.createdAt), 'dd/MM/yyyy')}</Text>
                </View>
            </ThemeView>
        </>
    );
}

const styles = StyleSheet.create({
    settingsContainer: {
        padding: 10,
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
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 0
    },
    iosPicker: {
        height: 150,
        marginBottom: 30
    },
})

export default SettingsListScreen;
