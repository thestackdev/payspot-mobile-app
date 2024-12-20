import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {View, NativeModules, StyleSheet} from 'react-native';
import {useEffect} from 'react';
import axios from 'axios';

const {EkycModule} = NativeModules;

type Props = NativeStackScreenProps<RootStackParamList, 'KYCAuth'>;

export default function KYCAuth({navigation, route}: Props) {
  async function onSubmit() {
    let userId = null;
    let token = null;
    try {
      const response = await axios.get('/user/auth');
      userId = response.data.id;

      const jwtTokenResponse = await axios.get('/jwt_token');
      token = jwtTokenResponse.data.token;
    } catch (error) {
      console.log(error);
    }

    if (token && userId) {
      EkycModule.startEkyc('PS003921', token, 'prod000' + userId)
        .then(response => {
          console.log('DMT Response:', response);
        })
        .catch(error => {
          console.error('DMT Error:', error);
        });
    }
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
