import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const DisplayValue = () => {

  const initValue = 0;
  const [value, setValue] = useState(initValue);

  test = (values) => {
    setValue(values[0]);
  }

  return (
    <View style={styles.container}>
      <View style={{ borderWidth: 1, borderColor: 'red', flex: 1, justifyContent: 'center' }}>
        <Text style={{ color: 'black' }}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default DisplayValue;
