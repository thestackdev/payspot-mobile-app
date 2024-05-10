import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import {RootStackParamList} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BalanceEnquiry'>;

export default function MiniStatement({navigation, route}: Props) {
  const {data} = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.item}>Response Code: {data.response_code}</Text>
      <Text style={styles.item}>Response Status: {data.response_status}</Text>
      <Text style={styles.item}>
        Transaction Amount: {data.transaction_amount}
      </Text>
      <Text style={styles.item}>Customer Name: {data.customer_name}</Text>
      <Text style={styles.item}>Reference No: {data.reference_no}</Text>
      <Text style={styles.item}>Date: {data.date}</Text>
      <Text style={styles.item}>Time: {data.time}</Text>
      <Text style={styles.item}>
        Response Description: {data.response_description}
      </Text>
      <Text style={styles.item}>Transaction ID: {data.transaction_id}</Text>
      <Text style={styles.item}>RRN: {data.rrn}</Text>
      <Text style={styles.item}>CRN_U: {data.CRN_U}</Text>
      <Text style={styles.item}>Created At: {data.created_at}</Text>
      <Text style={styles.title}>Statement:</Text>
      {data.mini_statement.map((item, index) => (
        <Text key={index} style={styles.item}>
          {item}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  item: {
    fontSize: 16,
    marginBottom: 10,
  },
});
