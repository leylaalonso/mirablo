import {Box} from '@react-native-material/core';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {RootStackParamList} from '../../App';
import EyeTracking from '../native/EyeTrackingView';

interface Props {}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1000000,
    height: 50,
    width: 100,
  },
});

const EyesStatusPannel: React.FC<Props> = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const goToConfig = () => {
    navigation.navigate('Config');
  };

  return (
    <Box onTouchStart={goToConfig} style={styles.container}>
      <EyeTracking />
    </Box>
  );
};

export default EyesStatusPannel;
