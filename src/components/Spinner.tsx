import ScreenWrapper from './ScreenWrapper';
import {ActivityIndicator, useTheme} from 'react-native-paper';

export default function Spinner() {
  const {colors} = useTheme();

  return (
    <ScreenWrapper
      styles={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute',
      }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </ScreenWrapper>
  );
}
