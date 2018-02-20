import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, ViewPropTypes } from 'react-native';
import { Button } from 'react-native-material-buttons';

import styles from './styles';

export default class DropdownItem extends React.Component {
  static defaultProps = {
    color: 'transparent',
    rippleContainerBorderRadius: 0,
    shadeBorderRadius: 0,
  };

  static propTypes = {
    style: (ViewPropTypes || View.propTypes).style,

    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),

    onPress: PropTypes.func,

    index: PropTypes.number.isRequired,
    baseColor: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    let { onPress, index } = this.props;

    if ('function' === typeof onPress) {
      onPress(index);
    }
  }

  render() {
    let { children, style, baseColor, ...props } = this.props;

    return (
      <Button
        {...props}

        style={[styles.container, style]}
        rippleColor={baseColor}
        shadeColor={baseColor}
        onPress={this.onPress}
      >
        {children}
      </Button>
    );
  }
}
