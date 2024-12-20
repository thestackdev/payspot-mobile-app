import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {View, NativeModules, StyleSheet} from 'react-native';
import {useEffect} from 'react';

const {EkycModule} = NativeModules;

type Props = NativeStackScreenProps<RootStackParamList, 'KYCAuth'>;

export default function KYCAuth({navigation, route}: Props) {
  async function onSubmit() {
    EkycModule.startEkyc(
      'your_partner_id',
      'your_api_key',
      'your_merchant_code',
    )
      .then(response => {
        console.log('DMT Response:', response);
      })
      .catch(error => {
        console.error('DMT Error:', error);
      });
  }

  useEffect(() => {
    onSubmit();
  });

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
});
