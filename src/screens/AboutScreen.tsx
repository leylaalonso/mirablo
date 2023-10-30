import {Box, Text} from '@react-native-material/core';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import BaseTemplate from '../templates/BaseTemplate';

const AboutScreen: React.FC = () => {
  return (
    <BaseTemplate title="Acerca de">
      <Text style={styles.text}>
        Esta es una aplicación para ayudar a personas con dificultades en la
        comunicación. La misma permite presentar opciones para que el usuario
        pueda seleccionar una de ellas con un sistema de seguimiento ocular.
      </Text>
      <Text style={styles.text}>
        Para lograr esto utilizamos las siguientes tecnologías:
      </Text>
      <Box style={styles.logosContainer}>
        <Image style={styles.logo} source={require('../assets/react.png')} />
        <Image style={styles.logo} source={require('../assets/ts.png')} />
        <Image
          style={styles.logo}
          source={require('../assets/mediapipe.jpg')}
        />
        <Image style={styles.logo} source={require('../assets/android.jpg')} />
        <Image
          style={styles.logo}
          source={require('../assets/tensorflow.jpg')}
        />
      </Box>
      <Text style={styles.text}>
        Los símbolos pictográficos utilizados en Mirablo son propiedad del
        Gobierno de Aragón y han sido creados por Sergio Palao para ARASAAC
        (http://www.arasaac.org), que los distribuye bajo Licencia Creative
        Commons BY-NC-SA.
      </Text>
      <Image
        style={styles.arasacLogo}
        source={require('../assets/logo-arasaac-texto.png')}
        resizeMode="contain"
      />
      <Text style={styles.text}>Creditos a: </Text>
      <Text style={styles.credits}>Alonso, Leyla</Text>
      <Text style={styles.credits}>Josevich, Danila</Text>
    </BaseTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    marginBottom: 8,
    color: 'gray',
    marginVertical: 20,
    textAlign: 'center',
  },
  credits: {
    fontSize: 20,
    alignContent: 'center',
    textAlign: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  arasacLogo: {
    height: 50,
    alignSelf: 'center',
  },
  logosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
});

export default AboutScreen;
