import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';

import Circles from '../src/index';
// import { NavigationType } from '../src/types';


export default function App() {

  const defaultValues1 = [1.1, 0.25, 1.33, 0.75, 0.999]
  const defaultValues2 = [0.75, 0.66, 0.1, 1.2, 1.9]
  // const [values, setValues] = useState(defaultValues1)
  const [values, setValues] = useState(defaultValues2)

  let [fontsLoaded] = useFonts({
    // 'dancingVar': require('./fonts/DancingScript-VariableFont_wght.ttf'),
    'cookie': require('./fonts/Cookie-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.container}>
      <Button color={'black'} title="0" onPress={() => setValues(defaultValues1)} />
      <Button color={'black'} title="1" onPress={() => setValues(defaultValues2)} />
      <View style={styles.background}>
        <Circles
          {...{
            values,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
  },
  text: {
    color: 'white',
    fontSize: 80,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'grey',
    justifyContent: 'flex-end',
  },
  background: {
    height: '70%',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  header: {
    flex: 0.75,
    backgroundColor: 'purple',
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
    backgroundColor: 'cyan',
  },
  bottom: {
    flex: 1.5,
    backgroundColor: 'purple',
  },
  page: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
  },
  // footer: {
  // flex: 0.5,
  // backgroundColor: 'orange',
  // },
});
