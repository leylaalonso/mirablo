import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {PropsWithChildren} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Box, Button, Text} from '@react-native-material/core';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = PropsWithChildren<{
  navigation: NavigationProp<any>;
}>;

const LoginScreen = ({navigation}: Props) => {
  const [isSigninInProgress, setIsSigninInProgress] = React.useState(false);

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '165066061137-l7642ghldv3uhfrol6egt8dnhmej2kst.apps.googleusercontent.com',
    });
  }, []);

  const signIn = async () => {
    try {
      setIsSigninInProgress(true);
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      auth().signInWithCredential(googleCredential);
      navigation.navigate('ShowOptions');
    } catch (error) {
      console.log({error});
    } finally {
      setIsSigninInProgress(false);
    }
  };

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
      <Box style={styles.loginButtonConainer}>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={signIn}
          disabled={isSigninInProgress}
        />
        <Button
          style={styles.emailLoginButton}
          onPress={() => navigation.navigate('EmailLogin')}
          disabled={isSigninInProgress}
          title="Iniciar sesión con Email"
          uppercase={false}
          leading={props => (
            <Icon name="email" {...props} style={styles.emailLoginButtonIcon} />
          )}
        />
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
  loginButtonConainer: {
    flex: 1,
    alignSelf: 'center',
  },
  emailLoginButton: {
    position: 'relative',
    marginTop: 20,
    marginHorizontal: 4,
  },
  emailLoginButtonIcon: {
    position: 'absolute',
    right: 30,
    top: -10,
  },
});

export default LoginScreen;
