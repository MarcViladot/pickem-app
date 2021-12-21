import styled from 'styled-components/native';
import {Theme} from '@react-navigation/native';

interface ThemeViewProps {
    theme: Theme;
}

export const ThemeView = styled.View<ThemeViewProps>`
    background-color: ${props => props.theme.colors.card};
`
