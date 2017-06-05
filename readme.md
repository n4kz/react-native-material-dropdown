[npm-badge]: https://img.shields.io/npm/v/react-native-material-dropdown.svg?colorB=ff6d00
[npm-url]: https://npmjs.com/package/react-native-material-dropdown
[license-badge]: https://img.shields.io/npm/l/react-native-material-dropdown.svg?colorB=448aff
[license-url]: https://raw.githubusercontent.com/n4kz/react-native-material-dropdown/master/license.txt
[textinput]: https://facebook.github.io/react-native/docs/textinput.html#props
[textfield]: https://github.com/n4kz/react-native-material-textfield#properties

# react-native-material-textfield

[![npm][npm-badge]][npm-url]
[![license][license-badge]][license-url]

Material dropdown with consistent behaviour on iOS and Android

## Roadmap

* [x] Ripple animation on press
* [ ] Layout animation on press
* [x] Fade in animation
* [x] Fade out animation
* [x] `focus()` and `blur()` support
* [x] Dynamic dropdown position
* [x] Dynamic dropdown size
* [x] Dynamic dropdown item size
* [x] Support external value updates
* [x] Highlight selected item
* [x] Configurable item count
* [ ] Documentation
* [ ] Example

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

 name                 | description                                 | type     | default
:-------------------- |:------------------------------------------- | --------:|:------------------
 animationDuration    | Text field animation duration in ms         |   Number | 225
 fontSize             | Text field font size                        |   Number | 16
 labelFontSize        | Text field label font size                  |   Number | 12
 baseColor            | Text field base color                       |   String | rgba(0, 0, 0, .38)
 itemColor            | Dropdown item text color (inactive items)   |   String | rgba(0, 0, 0, .54)
 textColor            | Dropdown item text color (active item)      |   String | rgba(0, 0, 0, .87)
 itemCount            | Dropdown visible item count                 |   Number | 4
 data                 | Dropdown item data                          |   Object | -
 value                | Selected value                              |   String | -

Other [TextField][textfield] and [TextInput][textinput] properties will also work

## Copyright and License

BSD License

Copyright 2017 Alexander Nazarov. All rights reserved.
