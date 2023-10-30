import {RangeSlider, Slider} from '@react-native-assets/slider';
import {Box, Button, Text} from '@react-native-material/core';
import {NavigationProp} from '@react-navigation/native';
import React, {PropsWithChildren} from 'react';
import {DimensionValue, ScrollView, StyleSheet, View} from 'react-native';
import BaseTemplate from '../templates/BaseTemplate';
import {MirabloContext, defaultConfig} from '../Db';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = PropsWithChildren<{
  navigation: NavigationProp<any>;
}>;

const styles = StyleSheet.create({
  slider: {
    width: 300,
    height: 40,
  },
  guageContainer: {
    position: 'relative',
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  gauge: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 40,
    backgroundColor: '#6750a5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    alignSelf: 'center',
  },
  gestureText: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6750a5',
  },
});

const ConfigScreen = ({}: Props) => {
  const {eyeTrackingState, config, setConfig, currentGesture} =
    React.useContext(MirabloContext);

  const rangeX = [
    config.lookLeftThreshold * -100,
    config.lookRightThreshold * 100,
  ] as [number, number];

  const rangeY = [
    config.lookDownThreshold * -100,
    config.lookUpThreshold * 100,
  ] as [number, number];

  const hadleChangeXRange = (newXRange: [number, number]) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      lookLeftThreshold: Math.abs(newXRange[0]) / 100,
      lookRightThreshold: Math.abs(newXRange[1]) / 100,
    }));
  };

  const hadleChangeYRange = (newYRange: [number, number]) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      lookDownThreshold: Math.abs(newYRange[0]) / 100,
      lookUpThreshold: Math.abs(newYRange[1]) / 100,
    }));
  };

  let currentGestureText = eyeTrackingState
    ? 'Mirando de frente'
    : 'Cara no detectada';
  switch (currentGesture) {
    case 'LOOKING_LEFT':
      currentGestureText = 'Mirando a la izquierda';
      break;
    case 'LOOKING_RIGHT':
      currentGestureText = 'Mirando a la derecha';
      break;
    case 'LOOKING_UP':
      currentGestureText = 'Mirando arriba';
      break;
    case 'LOOKING_DOWN':
      currentGestureText = 'Mirando abajo';
      break;
  }

  return (
    <BaseTemplate title="Configuración">
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.gestureText}>{currentGestureText}</Text>
          <Text variant="h4">Sensibilidad lateral</Text>
          <RangeSlider
            style={styles.slider}
            range={rangeX} // set the current slider's value
            minimumValue={-100} // Minimum value
            maximumValue={100} // Maximum value
            onValueChange={hadleChangeXRange} // Callback for when the value changes
          />
          <Box style={styles.guageContainer}>
            {!!eyeTrackingState && (
              <Box
                style={[
                  styles.gauge,
                  {
                    left: ((eyeTrackingState.x + 1) * 50 +
                      '%') as DimensionValue,
                  },
                ]}
              />
            )}
          </Box>
          <Text variant="h4">Sensibilidad vertical</Text>
          <RangeSlider
            style={styles.slider}
            range={rangeY} // set the current slider's value
            minimumValue={-100} // Minimum value
            maximumValue={100} // Maximum value
            onValueChange={hadleChangeYRange} // Callback for when the value changes
          />
          <Box style={styles.guageContainer}>
            {!!eyeTrackingState && (
              <Box
                style={[
                  styles.gauge,
                  {
                    left: ((eyeTrackingState.y + 1) * 50 +
                      '%') as DimensionValue,
                  },
                ]}
              />
            )}
          </Box>
          <Text variant="h4">Duración del gesto</Text>
          <Slider
            style={styles.slider}
            value={config.gestureDuration} // set the current slider's value
            minimumValue={0} // Minimum value
            maximumValue={2000} // Maximum value
            step={100}
            onValueChange={newDurtation =>
              setConfig({...config, gestureDuration: newDurtation})
            } // Callback for when the value changes
          />
          <Text>{config.gestureDuration} ms</Text>
          <Button
            title="Restaurar configuración"
            onPress={() => setConfig(defaultConfig)}
            color="error"
            leading={props => <Icon name="restore" {...props} />}
          />
          {/* <Text variant="h4">Blendshapes</Text>
        {!!eyeTrackingState &&
          Object.entries(eyeTrackingState)
            .filter(([k]) => k.includes('eyeLook'))
            .map(([key, value]) => (
              <Text key={key}>
                {key} = {Math.round(value * 100)} %
              </Text>
            ))} */}
        </View>
      </ScrollView>
    </BaseTemplate>
  );
};

export default ConfigScreen;
