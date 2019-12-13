import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Button } from 'react-native-material-buttons';

import styles from './styles';

export default class DropdownItem extends PureComponent {
  static defaultProps = {
    color: 'transparent',
    disabledColor: 'transparent',
    rippleContainerBorderRadius: 0,
    shadeBorderRadius: 0,
  };

  static propTypes = {
    ...Button.propTypes,

    index: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    let { onPress, index, disabled } = this.props;

    if ('function' === typeof onPress) {
      if (!disabled) onPress(index);
    }
  }

  render() {
    let { children, style, index, disabled, ...props } = this.props;

    return (
      <Button
        {...props}

        style={[styles.container, style]}
        onPress={this.onPress}
      >
        {children}
      </Button>
    );
  }
}
