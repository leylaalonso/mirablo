import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {Divider, Text} from '@react-native-material/core';

type Props = PropsWithChildren<{
  title: string;
}>;

const BaseTemplateStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  header: {
    textAlign: 'center',
    marginVertical: 10,
  },
});

const BaseTemplate = ({title, children}: Props) => {
  return (
    <View style={BaseTemplateStyle.container}>
      <Text variant="h2" style={BaseTemplateStyle.header}>
        {title}
      </Text>
      <Divider />
      <View style={BaseTemplateStyle.container}>{children}</View>
    </View>
  );
};

export default BaseTemplate;
