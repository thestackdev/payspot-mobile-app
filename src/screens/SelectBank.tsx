import {View, Text, StyleSheet} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import userMerchantStore from '../store/useMerchantStore';
import useSelectBankStore from '../store/useSelectBankStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectBank'>;

export default function SelectBank({navigation, route}: Props) {
  const banksList =
    userMerchantStore(state => state.merchant?.banks_list) || [];
  const {setSelectedBank} = useSelectBankStore();

  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: 10}}>
      <View>
        <View
          style={{
            width: '100%',
            marginTop: 12,
            borderWidth: 0.7,
            borderRadius: 4,
          }}>
          <SelectDropdown
            data={banksList.map(bank => ({
              id: bank.id,
              title: bank.bankName,
              icon: 'bank',
            }))}
            onSelect={(selectedItem, index) => {
              setSelectedBank(selectedItem.id);
              navigation.pop();
            }}
            search={true}
            disableAutoScroll={true}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  {selectedItem && (
                    <Icon
                      name={selectedItem.icon}
                      style={styles.dropdownButtonIconStyle}
                    />
                  )}
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.title) || 'Select your bank'}
                  </Text>
                  <Icon
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    style={styles.dropdownButtonArrowStyle}
                  />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && {backgroundColor: '#D2D9DF'}),
                  }}>
                  <Icon
                    name={item.icon}
                    style={styles.dropdownItemIconStyle}
                    color="#151E26"
                  />
                  <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
