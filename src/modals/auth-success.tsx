import {Modal, Portal, Text, Button} from 'react-native-paper';
import useModalStoreStore from '../store/useModalStore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StyleSheet} from 'react-native';

export default function AuthSuccess() {
  const {
    showSuccessModal,
    successMessage,
    setShowSuccessModal,
    setSuccessMessage,
  } = useModalStoreStore(state => state);

  function handleDismiss() {
    setShowSuccessModal(false);
    setSuccessMessage({title: '', message: ''});
  }

  return (
    <Portal>
      <Modal
        visible={showSuccessModal}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.containerStyle}>
        <AntDesign name="checkcircle" size={50} color="green" />
        <Text
          variant="titleLarge"
          style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
          {successMessage.title}
        </Text>
        <Text variant="bodyMedium" style={{textAlign: 'center'}}>
          {successMessage.message}
        </Text>
        <Button
          mode="contained"
          onPress={handleDismiss}
          style={{marginVertical: 20}}>
          Close
        </Button>
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
});
