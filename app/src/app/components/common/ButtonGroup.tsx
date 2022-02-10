import React, {FC, useEffect, useMemo, useState} from "react";
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useTranslation} from 'react-i18next';
import {Theme, useTheme} from '@react-navigation/native';

export interface IGroupButton {
    value: string | number | boolean;
    viewValue?: string;
}

interface IButton {
    button: IGroupButton;
    style: string;
}

interface Props {
    arrayOptions: IGroupButton[];
    initialValue: any;
    onSelect: (value: any) => void;
    fullWidth?: boolean;
}

const ButtonGroup: FC<Props> = ({arrayOptions, initialValue, onSelect, fullWidth}) => {

    const theme = useTheme();
    const {t} = useTranslation();
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const [buttonsList, setButtonsList] = useState<IButton[]>([]);
    const styles = useMemo(() => createStyles(theme), [theme]);

    useEffect(() => {
        const buttons: IButton[] = arrayOptions.map((opt, i) => {
            return {
                button: opt,
                style: i === 0 ? 'firstButton' : i === arrayOptions.length - 1 ? 'lastButton' : ''
            }
        });
        setButtonsList(buttons);
    }, []);

    const selectValue = (value) => {
        if (value !== selectedValue) {
            setSelectedValue(value);
            onSelect(value);
        }
    };

    return (
        <View style={styles.mainView}>
            <View style={[styles.buttonGroup, {width: fullWidth ? '100%' : '82%'}]}>
                {buttonsList.map((option, i) => (
                        <Pressable onPress={() => selectValue(option.button.value)} key={i}
                                   testID={`Button${option.button.value}`}
                                   style={[styles.button, styles[option.style], option.button.value === selectedValue ? styles.selectedButton : styles.blankButton]}>
                            <Text
                                style={option.button.value === selectedValue ? styles.selectedButtonText : styles.blankButtonText}>
                                {option.button.viewValue ? t(option.button.viewValue) : option.button.value}
                            </Text>
                        </Pressable>
                    )
                )}
            </View>
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        mainView: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        buttonGroup: {
            display: 'flex',
            flexDirection: 'row',
            height: 40,
            backgroundColor: theme.dark ? '#495666' : '#EBECF1',
            padding: 1,
            borderRadius: 50,
        },
        button: {
            borderRadius: 50,
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center'
        },
        selectedButton: {
            backgroundColor: theme.dark ? '#202D3A' : '#FFF'
        },
        blankButton: {
            backgroundColor: theme.dark ? '#495666' : '#EBECF1'
        },
        selectedButtonText: {
            fontSize: 13,
            color: theme.colors.text
        },
        blankButtonText: {
            fontSize: 13,
            color: "#9DA3AC"
        },
        disabledButton: {
            backgroundColor: '#CCCCCC',
        }
    });

export default ButtonGroup;



