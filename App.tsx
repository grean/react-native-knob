import React from 'react';
import { StyleSheet, View } from 'react-native';

import Knob from './components/Knob';

export default () => (
  <View style={styles.container}>
    <Knob />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
