[npm-badge]: https://img.shields.io/npm/v/react-native-material-dropdown.svg?colorB=ff6d00
[npm-url]: https://npmjs.com/package/react-native-material-dropdown
[license-badge]: https://img.shields.io/npm/l/react-native-material-dropdown.svg?colorB=448aff
[license-url]: https://raw.githubusercontent.com/n4kz/react-native-material-dropdown/master/license.txt
[example-url]: https://user-images.githubusercontent.com/2055622/27727487-591a807a-5d87-11e7-89f6-f31a442db0c6.gif
[textinput]: https://facebook.github.io/react-native/docs/textinput.html#props
[textfield]: https://github.com/n4kz/react-native-material-textfield#properties

# react-native-material-dropdown

[![npm][npm-badge]][npm-url]
[![license][license-badge]][license-url]

Material dropdown with consistent behaviour on iOS and Android

![example][example-url]

## Features

* Easy to use
* Consistent look and feel on iOS and Android
* Customizable font size, colors and animation duration
* Dynamic dropdown size and position
* Configurable visible item count
* Pure javascript implementation

## Installation

```bash
npm install --save react-native-material-dropdown
```

## Usage

```javascript
import React, { Component } from 'react';
import { Dropdown } from 'react-native-material-dropdown';

class Example extends Component {
  render() {
    let data = [{
      value: 'Banana',
    }, {
      value: 'Mango',
    }, {
      value: 'Pear',
    }];

    return (
      <Dropdown
        label='Favorite Fruit'
        data={data}
      />
    );
  }
}
```

## Properties

 name              | description                                   | type     | default
:----------------- |:--------------------------------------------- | --------:|:------------------
 label             | Text field label text (required)              |   String | -
 error             | Text field error text                         |   String | -
 animationDuration | Text field animation duration in ms           |   Number | 225
 fontSize          | Text field font size                          |   Number | 16
 labelFontSize     | Text field label font size                    |   Number | 12
 labelHeight       | Text field label height                       |   Number | 32
 baseColor         | Text field base color                         |   String | rgba(0, 0, 0, .38)
 textColor         | Text field text color                         |   String | rgba(0, 0, 0, .87)
 itemColor         | Dropdown item text color (inactive items)     |   String | rgba(0, 0, 0, .54)
 selectedItemColor | Dropdown item text color (active item)        |   String | rgba(0, 0, 0, .87)
 dropdownPosition  | Dropdown position (dynamic if undefined)      |   Number | -
 itemCount         | Dropdown visible item count                   |   Number | 4
 itemPadding       | Dropdown item vertical padding                |   Number | 8
 itemTextStyle     | Dropdown item text styles                     |   Object | -
 data              | Dropdown item data                            |   Object | -
 value             | Selected value                                |   String | -
 containerStyle    | Styles for container view                     |   Object | -
 pickerStyle       | Styles for item picker view                   |   Object | -
 shadeOpacity      | Shade opacity for dropdown items              |   Number | 0.12
 rippleOpacity     | Opacity for ripple effect                     |   Number | 0.54
 rippleInsets      | Insets for ripple on base component           |   Object | { top: 16, bottom: -8 }
 renderBase        | Render base component                         | Function | -
 renderAccessory   | Render text field accessory                   | Function | -
 onChangeText      | Selection callback (args: value, index, data) | Function | -

Other [TextField][textfield] and [TextInput][textinput] properties will also work

## Methods

 name            | description                    | returns
:--------------- |:------------------------------ |:--------
 focus()         | Acquire focus (open dropdown)  | -
 blur()          | Release focus (close dropdown) | -
 value()         | Get current value              | String
 selectedIndex() | Get selected index             | Number
 selectedItem()  | Get selected item              | Object
 isFocused()     | Get current focus state        | Boolean

## Example

```bash
git clone https://github.com/n4kz/react-native-material-dropdown
cd react-native-material-dropdown/example
npm install
npm run ios # or npm run android
```

## Copyright and License

BSD License

Copyright 2017 Alexander Nazarov. All rights reserved.
