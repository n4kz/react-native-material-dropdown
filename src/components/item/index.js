import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Button } from 'react-native-material-buttons';

import styles from './styles';

export default class DropdownItem extends PureComponent {
  static defaultProps = {
    color: 'transparent',
    rippleOpacity: 0.54,
    rippleContainerBorderRadius: 0,
    shadeBorderRadius: 0,
  };

  static propTypes = {
    ...Button.propTypes,

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
    let {
      children,
      style,
      animationDuration,
      baseColor,
      ...props
    } = this.props;

    return (
      <Button
        {...props}

        style={[styles.container, style]}
        rippleDuration={animationDuration * 2}
        rippleColor={baseColor}
        shadeColor={baseColor}
        onPress={this.onPress}
      >
        {children}
      </Button>
    );
  }
}
