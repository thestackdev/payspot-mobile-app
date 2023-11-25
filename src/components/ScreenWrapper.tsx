import React from 'react';
import {StatusBar, StyleProp, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

type Props = {
  children: React.ReactNode;
  styles?: StyleProp<ViewStyle>;
  statusBarColor?: string;
};

export default function ScreenWrapper({children, styles}: Props) {
  const {colors} = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        ...(styles as ViewStyle),
      }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
        hidden={false}
      />
      {children}
    </View>
  );
}
