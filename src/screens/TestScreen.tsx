import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {PropsWithChildren} from 'react';
import BaseTemplate from '../templates/BaseTemplate';
import RoundButton from '../components/RoundButton';

type Props = PropsWithChildren<{
  navigation: NavigationProp<any>;
}>;

const TestScreen = ({navigation}: Props) => {
  return (
    <BaseTemplate title="Calibrar la aplicación">
      <RoundButton
        title="TODO: Calibrar la aplicación"
        onPress={() => navigation.navigate('Home')}
      />
    </BaseTemplate>
  );
};

export default TestScreen;
