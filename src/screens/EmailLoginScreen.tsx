import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {PropsWithChildren} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Box, Button, Text, TextInput} from '@react-native-material/core';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = PropsWithChildren<{
  navigation: NavigationProp<any>;
}>;

const EmailLoginScreen = ({navigation}: Props) => {
  const [isSigninInProgress, setIsSigninInProgress] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const login = async () => {
    setErrorMessage('');
    setIsSigninInProgress(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('ShowOptions');
    } catch (error: any) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/user-disabled' ||
        error.code === 'auth/invalid-login'
      ) {
        setErrorMessage('Usuario o contraseña incorrectos');
      } else {
        setErrorMessage(error.message);
      }
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
        <TextInput
          label="Email"
          keyboardType="email-address"
          autoComplete="email"
          autoFocus
          inputMode="email"
          textContentType="emailAddress"
          leading={props => <Icon name="email" {...props} />}
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          label="Contraseña"
          keyboardType="default"
          textContentType="password"
          secureTextEntry
          autoComplete="password"
          passwordRules="minlength: 8; required: lower; required: upper; required: digit;"
          leading={props => <Icon name="lock" {...props} />}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        {errorMessage ? (
          <Text style={{color: 'red'}}>{errorMessage}</Text>
        ) : null}
        <Button
          color="primary"
          loading={isSigninInProgress}
          title="Iniciar sesión"
          onPress={login}
          trailing={props => <Icon name="send" {...props} />}
        />
        <Button
          color="secondary"
          title="Registrarse"
          leading={props => <Icon name="account-plus" {...props} />}
          onPress={() => navigation.navigate('NewEmailScreen')}
        />
        <Button
          title="Volver"
          onPress={() => navigation.goBack()}
          variant="text"
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
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
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    gap: 20,
  },
});

export default EmailLoginScreen;
