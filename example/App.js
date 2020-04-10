import React from 'react';
import { StyleSheet, View } from 'react-native';

// import { Knob } from '../dist/index.js';
import { Knob } from 'react-native-knob';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.knob}>
        <Knob
          negative={false}
          margin={100}
          padding={64}
          strokeWidth={50}
          gradientInt={[{ offset: '50%', stopColor: '#000' }, { offset: '80%', stopColor: '#fff' }]}
          gradientExt={[{ offset: '100%', stopColor: '#fff' }, { offset: '90%', stopColor: '#000' }]}
          textDisplay={false}
        />
        {/* gradientInt={[{ offset: '50%', stopColor: '#000' }, { offset: '80%', stopColor: '#fff' }]} */}
      </View>
      <View style={styles.knob}>
        <Knob
          margin={100}
          padding={64}
          strokeWidth={80}
          value={0}
          maxValue={1000}
          rotation={0}
          negative={true}
          colors={['#F0EFF5', '#E03997', '#6435C9', '#A5673F', '#AAA', '#888', '#666', '#444', '#222', '#000']}
          gradientInt={[{ offset: '50%', stopColor: '#000' }, { offset: '80%', stopColor: '#E03997' }]}
          gradientExt={[{ offset: '100%', stopColor: '#E03997' }, { offset: '80%', stopColor: '#000' }]}
          textStyle={{ color: '#E03997' }}
        />
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
  knob: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
