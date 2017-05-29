import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Text,
  View,
  ScrollView,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Button } from 'react-native-material-buttons';
import { TextField } from 'react-native-material-textfield';

import styles from './styles';

export default class Dropdown extends PureComponent {
  static defaultProps = {
    ...TextField.defaultProps,
  };

  static propTypes = {
    ...TextField.propTypes,

    value: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
    })),
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onClose = this.onClose.bind(this);
    this.updateRippleRef = this.updateRef.bind(this, 'ripple');
    this.updateContainerRef = this.updateRef.bind(this, 'container');
    this.updateScrollRef = this.updateRef.bind(this, 'scroll');
    this.renderAccessory = this.renderAccessory.bind(this);

    this.blur = this.onClose;
    this.focus = this.onPress;

    let { value } = this.props;

    this.state = {
      opacity: new Animated.Value(0),
      offset: 0,
      modal: false,
      value,
    };
  }

  isFocused() {
    return this.state.modal;
  }

  onPress(event) {
    let { value } = this.state;
    let { data, fontSize, onFocus, animationDuration } = this.props;

    let offset = 0;
    let timestamp = Date.now();

    /* Adjust event location */
    event.nativeEvent.locationY -= 16;

    /* Start ripple directly from event */
    this.ripple.startRipple(event);

    if (!data.length) {
      return;
    }

    if (value) {
      let index = data
        .indexOf(
          data
            .filter((item) => value === item.value)
            .shift()
        );

      if (~index) {
        offset = (index - 1) * (fontSize * 1.5 + 16);
      }
    }

    if ('function' === typeof onFocus) {
      onFocus();
    }

    this.container.measureInWindow((x, y, width, height) => {
      let { opacity } = this.state;
      let delay = Math.max(0, animationDuration - (Date.now() - timestamp));

      Animated
        .timing(opacity, {
          duration: animationDuration,
          toValue: 1,
          delay,
        })
        .start(() => {
          this.setState({
            modal: true,
            width: width + 16,
            top: y + Platform.select({ ios: 1, android: 0 }) + 24,
            left: x - 8,
            offset,
          });
        });
    });
  }

  onClose() {
    let { onBlur, animationDuration } = this.props;
    let { opacity } = this.state;

    Animated
      .timing(opacity, {
        duration: animationDuration,
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
    let { data = [], baseColor, fontSize, animationDuration } = this.props;

    let itemStyle = {
      height: fontSize * 1.5 + 16,
    };

    return data
      .map(({ value }, index) => (
        <Button
          color='transparent'
          style={[styles.item, itemStyle]}
          rippleContainerBorderRadius={0}
          rippleDuration={animationDuration * 2}
          rippleColor={baseColor}
          rippleOpacity={0.54}
          shadeColor={baseColor}
          shadeBorderRadius={0}
          onPress={() => this.onSelect(index)}
          key={index}
        >
          <Text style={{ fontSize }}>{value}</Text>
        </Button>
      ));
  }

  render() {
    let { value, left, top, width, opacity, modal } = this.state;
    let { data, ...props } = this.props;
    let { fontSize, baseColor, animationDuration } = props;

    let dimensions = Dimensions.get('window');
    let itemSize = fontSize * 1.5 + 16;

    let overlayStyle = {
      width: dimensions.width,
      height: dimensions.height,
    };

    let pickerStyle = {
      width,
      top,
      left,
      opacity,
      minHeight: itemSize + 16,
      maxHeight: (itemSize * 5) + 16 - 24,
      transform: [{
        translateY: -(itemSize + 8),
      }],
    };

    let rippleStyle = {
      position: 'absolute',
      top: 16,
      left: 0,
      right: 0,
      height: fontSize * 1.5 + 16 + 8,
    };

    return (
      <View onLayout={() => undefined} ref={this.updateContainerRef}>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <View pointerEvents='box-only'>
            <TextField
              {...props}

              value={value}
              editable={false}
              onChangeText={undefined}
              renderAccessory={this.renderAccessory}
            />

            <Ripple
              style={rippleStyle}
              rippleColor={baseColor}
              rippleDuration={animationDuration * 2}
              rippleOpacity={0.54}
              rippleSequential={true}
              ref={this.updateRippleRef}
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
