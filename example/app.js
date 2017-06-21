import React, { Component } from 'react';
import { AppRegistry, ScrollView, Text, View } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';

export default function init() {
  class Example extends Component {
    constructor(props) {
      super(props);

      this.onChangeText = this.onChangeText.bind(this);

      this.codeRef = this.updateRef.bind(this, 'code');
      this.nameRef = this.updateRef.bind(this, 'name');
      this.sampleRef = this.updateRef.bind(this, 'sample');
      this.typographyRef = this.updateRef.bind(this, 'typography');

      this.state = {
        sample: 'Sample text',
        typography: 'Headline',
        name: 'Blue',
      };
    }

    onChangeText(text) {
      ['name', 'code', 'sample', 'typography']
        .map((name) => ({ name, ref: this[name] }))
        .filter(({ ref }) => ref && ref.isFocused())
        .forEach(({ name, ref }) => {
          this.setState({ [name]: text });
        });
    }

    updateRef(name, ref) {
      this[name] = ref;
    }

    render() {
      let { typography, name, code, sample } = this.state;

      let textStyle = [
        styles.text,
        styles[typography],
        styles[name + code],
      ];

      return (
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <TextField
              ref={this.sampleRef}
              value={sample}
              onChangeText={this.onChangeText}
              label='Sample'
            />

            <Dropdown
              ref={this.typographyRef}
              value={typography}
              onChangeText={this.onChangeText}
              label='Typography'
              data={typographyData}
            />

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Dropdown
                  ref={this.nameRef}
                  value={name}
                  onChangeText={this.onChangeText}
                  label='Name'
                  data={colorNameData}
                />
              </View>

              <View style={{ width: 96, marginLeft: 8 }}>
                <Dropdown
                  ref={this.codeRef}
                  value={code}
                  onChangeText={this.onChangeText}
                  label='Code'
                  data={colorCodeData}
                />
              </View>
            </View>
          </View>

          <View style={[styles.container, styles.textContainer]}>
            <Text style={textStyle}>{sample}</Text>
          </View>
        </ScrollView>
      );
    }
  }

  AppRegistry.registerComponent('example', () => Example);
}

const styles = {
  scroll: {
    paddingHorizontal: 4,
    paddingVertical: 48,
    backgroundColor: '#E8EAF6',
  },

  container: {
    marginHorizontal: 4,
    marginVertical: 8,
    paddingHorizontal: 8,
  },

  text: {
    textAlign: 'center',
  },

  textContainer: {
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 16,
    elevation: 1,
    shadowRadius: 1,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },

  Display2: { fontSize: 45 },
  Display1: { fontSize: 34 },
  Headline: { fontSize: 24 },
  Title: { fontSize: 20, fontWeight: '500' },
  Subheading: { fontSize: 16 },
  Body: { fontSize: 14 },
  Caption: { fontSize: 12 },

  Blue900: { color: '#0D47A1' },
  Blue700: { color: '#1976D2' },
  BlueA700: { color: '#2962FF' },
  BlueA400: { color: '#2979FF' },

  Teal900: { color: '#004D40' },
  Teal700: { color: '#00796B' },
  TealA700: { color: '#00BFA5' },
  TealA400: { color: '#1DE9B6' },

  Cyan900: { color: '#006064' },
  Cyan700: { color: '#0097A7' },
  CyanA700: { color: '#00E5FF' },
  CyanA400: { color: '#00B8D4' },
};

const typographyData = [
  { value: 'Display2' },
  { value: 'Display1' },
  { value: 'Headline' },
  { value: 'Title' },
  { value: 'Subheading' },
  { value: 'Body' },
  { value: 'Caption' },
];

const colorNameData = [
  { value: 'Blue' },
  { value: 'Teal' },
  { value: 'Cyan' },
];

const colorCodeData = [
  { value: '900' },
  { value: '700' },
  { value: 'A700' },
  { value: 'A400' },
];
