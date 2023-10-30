import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {RootStackParamList} from '../../App';
import {useGestureEffect, useQuestion} from '../hooks/commonHooks';
import BaseTemplate from '../templates/BaseTemplate';
import {Box, Flex, Snackbar, Text} from '@react-native-material/core';
import {Image, Pressable, StyleSheet} from 'react-native';
import {MirabloContext, QuestionOption} from '../Db';
import Tts from 'react-native-tts';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectOption'>;

const SelectOptionScreen = ({navigation, route}: Props) => {
  const [message, setMessage] = React.useState('');
  const {currentGesture} = React.useContext(MirabloContext);

  const {id} = route.params;
  const question = useQuestion(id);

  useEffect(() => {
    Tts.setDefaultVoice('es-ES-language');
    Tts.setDefaultRate(0.5);
    if (question) {
      Tts.speak(question.title);
    }
  }, [question]);

  const selectOption = (selected: string) => {
    if (message) return;
    setMessage(selected);
    Tts.speak(selected);
    setTimeout(() => {
      setMessage('');
      navigation.navigate('ShowOptions');
    }, 1000);
  };

  const [option1, option2] = question?.options ?? [];

  const handlePress = (option: QuestionOption) => {
    selectOption(option.title);
  };

  useGestureEffect(
    selectedGesture => {
      if (selectedGesture === 'LOOKING_LEFT') {
        handlePress(option1);
      }
      if (selectedGesture === 'LOOKING_RIGHT') {
        handlePress(option2);
      }
      if (selectedGesture === 'LOOKING_UP') {
        selectOption('Ninguno de los dos');
      }
    },
    ['LOOKING_LEFT', 'LOOKING_RIGHT', 'LOOKING_UP'],
  );

  if (!question) {
    return <Text>Not found</Text>;
  }

  return (
    <BaseTemplate title={question.title}>
      <Flex fill direction="column" items="center">
        <Pressable
          style={
            currentGesture === 'LOOKING_UP' && !message ? styles.select : {}
          }
          onPress={() => selectOption('Ninguno de los dos')}>
          <Box w="100%" style={{width: '100%', alignContent: 'center'}}>
            <Image
              style={styles.pictogramSmall}
              source={{
                uri: 'https://static.arasaac.org/pictograms/26941/26941_300.png',
              }}
            />
            <Text style={styles.text} variant="button">
              Ninguno
            </Text>
          </Box>
        </Pressable>
        <Flex
          borderTop={1}
          fill
          direction="row"
          justify="center"
          items="center">
          <Flex
            fill
            direction="row"
            justify="center"
            h="100%"
            items="center"
            style={
              currentGesture === 'LOOKING_LEFT' && !message ? styles.select : {}
            }
            borderRight={1}>
            <Pressable onPress={() => handlePress(option1)}>
              <Text style={styles.text} variant="button">
                {option1.title}
              </Text>
              <Image
                style={styles.pictograms}
                source={{
                  uri: option1.image,
                }}
              />
            </Pressable>
          </Flex>
          <Flex
            fill
            direction="row"
            h="100%"
            items="center"
            justify="center"
            style={
              currentGesture === 'LOOKING_RIGHT' && !message
                ? styles.select
                : {}
            }>
            <Pressable onPress={() => handlePress(option2)}>
              <Text style={styles.text} variant="button">
                {option2.title}
              </Text>
              <Image
                style={styles.pictograms}
                source={{
                  uri: option2.image,
                }}
              />
            </Pressable>
          </Flex>
        </Flex>
      </Flex>
      {!!message && <Snackbar message={message} />}
    </BaseTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pictograms: {
    width: 200,
    height: 200,
  },
  pictogramSmall: {
    width: 100,
    height: 100,
  },
  snackbar: {
    position: 'absolute',
    start: 16,
    end: 16,
    bottom: 16,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
  },
  select: {
    backgroundColor: '#5bb75b',
  },
});

export default SelectOptionScreen;
