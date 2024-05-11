import {Modal, Portal, Text, Button} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StyleSheet, Dimensions, ScrollView, View} from 'react-native';
import useBalanceEnquiryStore from '../store/useBalanceEnquiry';
import {useNavigation} from '@react-navigation/native';

export default function BalanceEnquiryModal() {
  const navigation = useNavigation();
  const {
    balanceEnquiry,
    setBalanceEnquiryMessage,
    setShowBalanceEnquiryModal,
    showBalanceEnquiryModal,
  } = useBalanceEnquiryStore(state => state);

  function handleDismiss() {
    setShowBalanceEnquiryModal(false);
    setBalanceEnquiryMessage({
      bank_selected: '',
      mobile: '',
      aadhar: '',
      balance: '',
      rrn: '',
      transaction_id: '',
      receipt_url: '',
    });
  }

  function handleHome() {
    handleDismiss();
    navigation.goBack();
  }

  return (
    <Portal>
      <Modal
        visible={showBalanceEnquiryModal}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.containerStyle}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            gap: 10,
          }}>
          <AntDesign name="checkcircle" size={50} color="green" />
          <Text style={styles.headerTitle}>Transaction Success</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.messageText}>
            Bank: {balanceEnquiry.bank_selected}
          </Text>
          <Text style={styles.messageText}>
            Balance: {balanceEnquiry.balance}
          </Text>
          <Text style={styles.messageText}>RRN: {balanceEnquiry.rrn}</Text>
          <Text style={styles.messageText}>
            Mobile: {balanceEnquiry.mobile}
          </Text>
          <Text style={styles.messageText}>
            Transaction ID: {balanceEnquiry.transaction_id}
          </Text>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}>
          <Button
            mode="contained"
            onPress={handleDismiss}
            style={styles.closeButton}>
            Close
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    gap: 10,
    width: windowWidth * 0.9,
    maxHeight: windowHeight * 0.7,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    alignSelf: 'center',
    borderRadius: 5,
    width: '50%',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    alignSelf: 'center',
    borderRadius: 5,
    width: '100%',
  },
  messageText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'flex-start',
    textAlign: 'left',
    width: '100%',
  },
});
