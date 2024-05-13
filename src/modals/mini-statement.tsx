import {Modal, Portal, Text, Button} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StyleSheet, Dimensions, ScrollView, View} from 'react-native';
import useMiniStatementStore from '../store/useMiniStatement';

export default function MiniStatementModal() {
  const {
    miniStatement,
    setMiniStatementMessage,
    setShowMiniStatementModal,
    showMiniStatementModal,
  } = useMiniStatementStore(state => state);

  function handleDismiss() {
    setShowMiniStatementModal(false);
    setMiniStatementMessage({
      result: {
        message: '',
        bank_selected: '',
        aadhar: '',
        balance: '',
        rrn: '',
      },
      result_statement: [],
      receipt_url: '',
    });
  }

  return (
    <Portal>
      <Modal
        visible={showMiniStatementModal}
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
            Bank: {miniStatement.result.bank_selected}
          </Text>
          <Text style={styles.messageText}>
            RRN: {miniStatement.result.rrn}
          </Text>
          <Text style={styles.messageText}>
            Aadhar: {miniStatement.result.aadhar}
          </Text>
          <Text style={styles.title}>Statement:</Text>
          {miniStatement.result_statement.map((item, index) => (
            <Text key={index} style={styles.messageText}>
              {item}
            </Text>
          ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
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
