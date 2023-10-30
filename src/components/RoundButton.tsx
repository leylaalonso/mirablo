import React from 'react';
import {Button} from '@react-native-material/core';

interface Props {
  title: string;
  onPress?: () => void;
}

function RoundButton({title, onPress}: Props) {
  return <Button title={title} onPress={onPress} />;
}

export default RoundButton;
