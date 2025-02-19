import {Modal, Portal, Text, Button} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StyleSheet, Dimensions, ScrollView, View} from 'react-native';
import useCashwithdralStore from '../store/useCashwithdral';
import {useNavigation} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';

export default function CashWithdrawalModal() {
  const {
    cashwithdraw,
    showWithdrawModal,
    setWithdrawMessage,
    setShowWithdrawModal,
  } = useCashwithdralStore(state => state);

  const navigation = useNavigation();

  function handleDismiss() {
    setShowWithdrawModal(false);
    setWithdrawMessage({
      status: '',
      amount: '',
      details: {
        balance: '',
        rrn: '',
        clientrefno: '',
        mobile: '',
        aadhar: '',
        bank_selected: '',
      },
      receipt_url: '',
      current_balance: '',
    });
  }

  function handleHome() {
    handleDismiss();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Home'}],
      }),
    );
  }

  return (
    <Portal>
      <Modal
        visible={showWithdrawModal}
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
          <Text style={[styles.messageText, styles.messageBold]}>
            Withdraw Amount: {cashwithdraw.amount}
          </Text>
          <Text style={styles.messageText}>
            Remaning Balance: {cashwithdraw.details.balance}
          </Text>
          <Text style={styles.messageText}>
            RRN: {cashwithdraw.details.rrn}
          </Text>
          <Text style={styles.messageText}>
            Mobile: {cashwithdraw.details.mobile}
          </Text>
          <Text style={styles.messageText}>
            Bank Selected: {cashwithdraw.details.bank_selected}
          </Text>
          <Text style={styles.messageText}>
            Aadhar: {cashwithdraw.details.aadhar}
          </Text>
          <Text style={[styles.messageText, styles.messageBold]}>
            Wallet Balance: {cashwithdraw.current_balance}
          </Text>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            gap: 10,
          }}>
          <Button
            icon="home-plus-outline"
            onPress={handleHome}
            style={styles.closeButton}>
            Home
          </Button>
          <Button
            icon="plus"
            onPress={handleDismiss}
            style={styles.transactionButton}>
            Transactions
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
    color: 'white',
    alignSelf: 'center',
    borderRadius: 5,
    width: '50%',
  },
  transactionButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    alignSelf: 'center',
    borderRadius: 5,
    width: '50%',
  },
  messageText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  messageBold: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'flex-start',
    textAlign: 'left',
    width: '100%',
  },
});
