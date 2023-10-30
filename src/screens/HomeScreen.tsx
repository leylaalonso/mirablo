import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {PropsWithChildren} from 'react';
import RoundButton from '../components/RoundButton';
import BaseTemplate from '../templates/BaseTemplate';
import {StyleSheet, View} from 'react-native';

type Props = PropsWithChildren<{
  navigation: NavigationProp<any>;
}>;

const HomeScreen = ({navigation}: Props) => {
  return (
    <BaseTemplate title="Que quieres hacer ahora?">
      <View style={styles.container}>
        <RoundButton
          title="Calibrar la aplicación"
          onPress={() => navigation.navigate('Test')}
        />
        <RoundButton
          title="Presentar opciones"
          onPress={() => navigation.navigate('ShowOptions')}
        />
        <RoundButton
          title="Editar opciones"
          onPress={() => navigation.navigate('EditOptions')}
        />
      </View>
    </BaseTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    alignSelf: 'center',
  },
});

export default HomeScreen;
