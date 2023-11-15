import {MD3LightTheme as DefaultTheme} from 'react-native-paper';
import colors from './colors.json';

const fontConfig = {
  default: {
    fontFamily: 'Jost-Regular',
    fontWeight: '400',
    letterSpacing: 0,
  },
  titleSmall: {
    fontFamily: 'Jost-Bold',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  titleMedium: {
    fontFamily: 'Jost-Bold',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleLarge: {
    fontFamily: 'Jost-Bold',
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 28,
  },
};

const theme = {
  ...DefaultTheme,
  colors: colors.colors,
  fontConfig: fontConfig,
};

export default theme;
