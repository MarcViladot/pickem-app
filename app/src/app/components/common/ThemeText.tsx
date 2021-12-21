import styled from 'styled-components/native';
import {Theme} from '@react-navigation/native';

interface ThemeTextProps {
    theme: Theme;
}

export const ThemeText = styled.Text<ThemeTextProps>`
    color: ${props => props.theme.colors.text};
`
