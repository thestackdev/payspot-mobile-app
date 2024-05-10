import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {RootStackParamList} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BalanceEnquiry'>;

export default function BalanceEnquiry({navigation, route}: Props) {
  const {data} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Response Status: {data.response_status}</Text>
      <Text style={styles.text}>Response Code: {data.response_code}</Text>
      <Text style={styles.text}>
        Response Description: {data.response_description}
      </Text>
      <Text style={styles.text}>Transaction ID: {data.transaction_id}</Text>
      <Text style={styles.text}>Reference No: {data.reference_no}</Text>
      <Text style={styles.text}>Date: {data.date}</Text>
      <Text style={styles.text}>Time: {data.time}</Text>
      <Text style={styles.text}>CRN_U: {data.CRN_U}</Text>
      <Text style={styles.text}>Created At: {data.created_at}</Text>
      <Text style={styles.title}>Balance: {data.balance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});
