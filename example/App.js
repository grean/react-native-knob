import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Dimensions } from 'react-native';

// import { Knob } from '../dist/index.js';
import { Knob } from 'react-native-knob';



export default App = () => {
  const [val1, setVal1] = useState(40);
  const [knobValue, setKnobValue] = useState(50);
  const { width, height } = Dimensions.get("window");
  const [isLandscape, setIsLandscape] = useState(height < width);
  // let knobValue = 50;
  let buttons = [-100, -33, -25, 0, 25, 33, 100];
  // const [random, setRandom] = useState(Math.random());
  callback = (values) => {
    // setVal1(val1 + 1)
    // _textInput1.text = valTmp.toString();

    setKnobValue(values[0]);
    // knobValue = values[0];
    // _textInput1.setNativeProps({ text: knobValue.toString() });
    // _textInput2.setNativeProps({ text: (knobValue * 2).toString() });
  }

  updateKnobValue = (value) => {
    _knobRef.setValue(value === 0 ? value : knobValue + value);
  }

  onLayout = () => {
    console.log("layautChangeApp");
    const { width, height } = Dimensions.get("window");
    setIsLandscape(height < width);
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: isLandscape ? 'row' : 'column',
      alignItems: 'center',
    },
    labels: {
      flex: 1,
      flexDirection: isLandscape ? 'column' : 'row',
      justifyContent: 'center',
    },
    label: {
      flex: 1,
      textAlign: 'center',
    },
    buttons: {
      flex: 1,
      flexDirection: isLandscape ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      padding: 10,
      marginHorizontal: 50,
      backgroundColor: '#E03997',
      color: 'white',
    },
  });



  return (
    <View style={styles.container} onLayout={this.onLayout}>
      <View style={styles.labels}>
        <TextInput
          value={knobValue.toString()}
          style={styles.label}
          ref={component => _textInput1 = component}
        />
        <TextInput
          style={styles.label}
          ref={component => _textInput2 = component}
        />
        <TextInput
          value={val1.toString()}
          style={styles.label}
        />
      </View>
      <View style={styles.buttons}>
        <Button
          style={styles.button}
          title="Change State"
          onPress={() => setVal1(val1 + 1)}
        />
      </View>
      <View style={styles.buttons}>
        {buttons.map((val, i) => <Button
          key={i}
          style={styles.button}
          title={val.toString()}
          onPress={() => updateKnobValue(val)}
        />)}
      </View>
      <Knob
        ref={component => _knobRef = component}
        margin={0}
        padding={32}
        strokeWidth={80}
        value={knobValue}
        maxValue={100}
        rotation={0}
        negative={true}
        colors={['#F0EFF5', '#E03997', '#6435C9', '#A5673F', '#AAA', '#888', '#666', '#444', '#222', '#000']}
        gradientInt={[{ offset: '50%', stopColor: '#000' }, { offset: '80%', stopColor: '#E03997' }]}
        gradientExt={[{ offset: '100%', stopColor: '#E03997' }, { offset: '80%', stopColor: '#000' }]}
        textStyle={{ color: '#E03997' }}
        {...{ callback }}
        style={{ flex: 2 }}
      />
      {/* canvasSize={300} */}
    </View>
  );
};


