import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {PropsWithChildren} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Box, Text} from '@react-native-material/core';
import {MirabloContext} from '../Db';

type Props = PropsWithChildren<{
  navigation: NavigationProp<any>;
}>;

const SplashScreen = ({navigation}: Props) => {
  const context = React.useContext(MirabloContext);

  React.useEffect(() => {
    setTimeout(() => {
      if (!context.user) {
        navigation.navigate('Login');
      } else {
        navigation.navigate('ShowOptions');
      }
    }, 2000);
  }, [navigation, context.user]);

  return (
    <Box style={styles.container}>
      <Box style={styles.logoconainter}>
        <Image
          style={styles.logo}
          source={require('../assets/mirablologo.png')}
          resizeMode="contain"
        />
        <Text style={styles.brand}>MIRABLO</Text>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    alignSelf: 'center',
  },
  logoconainter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    color: '#7156a8',
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  logo: {
    height: 100,
    alignSelf: 'center',
  },
});

export default SplashScreen;
