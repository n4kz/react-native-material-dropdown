import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Text,
  View,
  ScrollView,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import { Button } from 'react-native-material-buttons';
import { TextField } from 'react-native-material-textfield';

import styles from './styles';

export default class Dropdown extends PureComponent {
  static defaultProps = {
    overlayColor: 'transparent',
  };

  static propTypes = {
    overlayColor: PropTypes.string,

    value: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
    })),

    onChangeText: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onClose = this.onClose.bind(this);
    this.updateContainerRef = this.updateRef.bind(this, 'container');
    this.updateScrollRef = this.updateRef.bind(this, 'scroll');
    this.renderAccessory = this.renderAccessory.bind(this);

    this.blur = this.onClose;
    this.focus = this.onPress;

    this.state = {
      opacity: new Animated.Value(1),
      offset: 0,
      value: this.props.value,
      modal: false,
    };
  }

  isFocused() {
    return this.state.modal;
  }

  onPress() {
    let { value } = this.state;
    let { data, onFocus } = this.props;

    let offset = 0;

    if (value) {
      let index = data
        .indexOf(
          data
            .filter((item) => value === item.value)
            .shift()
        );

      if (~index) {
        offset = (index - 1) * 36;
      }
    }

    this.container.measureInWindow((x, y, width, height) => {
      this.setState(({ opacity }) => {
        opacity.setValue(1);

        return {
          modal: true,
          width: width + 16,
          top: Platform.select({ ios: y + 1, android: y }) + 26,
          left: x - 8,
          offset,
        };
      });

      if ('function' === typeof onFocus) {
        onFocus();
      }
    });
  }

  onClose() {
    let { onBlur, animationDuration } = this.props;
    let { opacity } = this.state;

    Animated
      .timing(opacity, {
        duration: animationDuration,
        easing: Easing.out(Easing.ease),
        toValue: 0,
      })
      .start(() => {
        if ('function' === typeof onBlur) {
          onBlur();
        }

        this.setState({ modal: false });
      });
  }

  onSelect(index) {
    let { data, onChangeText, animationDuration } = this.props;
    let { value } = data[index];

    if ('function' === typeof onChangeText) {
      onChangeText(value);
    }

    this.setState({ value });

    setTimeout(this.onClose, animationDuration);
  }

  updateRef(name, ref) {
    this[name] = ref;

    /* XXX: Initial position for ScrollView */
    /* FIXME: Android */
    if ('scroll' === name && ref) {
      let { offset } = this.state;

      ref.scrollTo({ x: 0, y: offset, animated: false });
    }
  }

  renderAccessory() {
    let triangleStyle = {
      backgroundColor: TextField.defaultProps.baseColor,
    };

    return (
      <View style={styles.accessory}>
        <View style={styles.triangleContainer}>
          <View style={[styles.triangle, triangleStyle]} />
        </View>
      </View>
    );
  }

  renderItems() {
    let { data, baseColor, animationDuration } = this.props;

    return data
      .map(({ value }, index) => (
        <Button
          color='transparent'
          style={styles.item}
          rippleContainerBorderRadius={0}
          rippleDuration={animationDuration * 2}
          rippleColor={baseColor}
          rippleOpacity={0.54}
          shadeColor={baseColor}
          shadeBorderRadius={0}
          onPress={() => this.onSelect(index)}
          key={index}
        >
          <Text style={styles.text}>{value}</Text>
        </Button>
      ));
  }

  render() {
    let { value, left, top, width, opacity, modal } = this.state;
    let { data, onChangeText, overlayColor, ...props } = this.props;

    let dimensions = Dimensions.get('window');

    let overlayStyle = {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: overlayColor,
    };

    let pickerStyle = {
      width,
      top,
      left,
      opacity,
    };

    return (
      <View onLayout={() => undefined} ref={this.updateContainerRef}>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <View pointerEvents='box-only'>
            <TextField
              {...props}

              value={value}
              editable={false}
              renderAccessory={this.renderAccessory}
            />
          </View>
        </TouchableWithoutFeedback>

        <Modal visible={modal} transparent={true} onRequestClose={this.onClose}>
          <TouchableWithoutFeedback onPress={this.onClose}>
            <View style={overlayStyle}>
              <Animated.View style={[styles.picker, pickerStyle]}>
                <ScrollView
                  ref={this.updateScrollRef}
                  style={styles.scroll}
                  contentContainerStyle={styles.scrollContainer}
                >
                  {this.renderItems()}
                </ScrollView>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}
