import {Modal, Portal, Text, Button} from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import useModalStoreStore from '../store/useModalStore';
import {ScrollView, StyleSheet} from 'react-native';

export default function AuthFailed() {
  const {errorMessage, setErrorMessage, showErrorModal, setShowErrorModal} =
    useModalStoreStore(state => state);

  function handleDismiss() {
    setShowErrorModal(false);
    setErrorMessage({title: '', message: ''});
  }

  return (
    <Portal>
      <Modal
        visible={showErrorModal}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.containerStyle}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <FeatherIcon name="x-circle" size={50} color="red" />
          <Text
            variant="titleLarge"
            style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
            {errorMessage.title}
          </Text>
          <Text variant="bodyMedium" style={{textAlign: 'center'}}>
            {errorMessage.message}
          </Text>
          <Button
            mode="contained"
            onPress={handleDismiss}
            style={{marginVertical: 20}}>
            Close
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
