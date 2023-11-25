import {PermissionsAndroid} from 'react-native';

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Payspot App',
        message: 'Payspot App needs access to your location',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
      console.log('location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
