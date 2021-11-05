import React, { FC, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {useTranslation} from 'react-i18next';

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
}

const ButtonGroup: FC<Props> = ({arrayOptions, initialValue, onSelect}) => {

    const {t} = useTranslation();
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const [buttonsList, setButtonsList] = useState<IButton[]>([]);

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
            <View style={styles.buttonGroup}>
                {buttonsList.map((option, i) => (
                        <Pressable onPress={() => selectValue(option.button.value)} key={i} testID={`Button${option.button.value}`}
                                          style={[styles.button, styles[option.style], option.button.value === selectedValue ? styles.selectedButton : styles.blankButton]}>
                            <Text style={option.button.value === selectedValue ? styles.selectedButtonText : styles.blankButtonText}>
                                {option.button.viewValue ? t(option.button.viewValue) : option.button.value}
                            </Text>
                        </Pressable>
                    )
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'row',
        width: '82%',
       /* borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden'
        borderColor: "#1C75BC",*/
        height: 40,
        backgroundColor: '#EBECF1',
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
        backgroundColor: '#FFF'
    },
    blankButton: {
        backgroundColor: '#EBECF1'
    },
    selectedButtonText: {
        fontSize: 13,
        color: '#000'
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



