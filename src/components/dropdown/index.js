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
import { TextField } from 'react-native-material-textfield';

import DropdownItem from '../item';
import styles from './styles';

export default class Dropdown extends PureComponent {
  static defaultProps = {
    animationDuration: 225,
    fontSize: 16,

    textColor: 'rgba(0, 0, 0, .87)',
    itemColor: 'rgba(0, 0, 0, .54)',
    baseColor: 'rgba(0, 0, 0, .38)',
  };

  static propTypes = {
    animationDuration: PropTypes.number,
    fontSize: PropTypes.number,

    value: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
    })),

    textColor: PropTypes.string,
    itemColor: PropTypes.string,
    baseColor: PropTypes.string,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.updateRippleRef = this.updateRef.bind(this, 'ripple');
    this.updateContainerRef = this.updateRef.bind(this, 'container');
    this.updateScrollRef = this.updateRef.bind(this, 'scroll');
    this.renderAccessory = this.renderAccessory.bind(this);

    this.blur = this.onClose;
    this.focus = this.onPress;

    let { value } = this.props;

    this.state = {
      opacity: new Animated.Value(0),
      selected: -1,
      modal: false,
      value,
    };
  }

  componentWillReceiveProps({ value }) {
    if (value !== this.props.value) {
      this.setState({ value });
    }
  }

  onPress(event) {
    let { data = [], fontSize, onFocus, animationDuration } = this.props;

    let itemCount = data.length;
    let visibleItemCount = this.visibleItemCount();
    let timestamp = Date.now();

    /* Adjust event location */
    event.nativeEvent.locationY -= 16;

    /* Start ripple directly from event */
    this.ripple.startRipple(event);

    if (!itemCount) {
      return;
    }

    if ('function' === typeof onFocus) {
      onFocus();
    }

    this.container.measureInWindow((x, y, width, height) => {
      let { opacity } = this.state;

      let delay = Math.max(0, animationDuration - (Date.now() - timestamp));
      let selected = this.selectedIndex();
      let offset = 0;

      if (itemCount > visibleItemCount) {
        switch (selected) {
          case 0:
          case 1:
            break;

          case itemCount - 1:
          case itemCount - 2:
            offset = this.itemSize() * (itemCount - 4);
            break;

          default:
            offset = this.itemSize() * (selected - 1);
        }
      }

      this.setState({
        modal: true,
        width: width + 16,
        top: y + Platform.select({ ios: 1, android: 0 }) + 24,
        left: x - 8,
        selected,
      });

      setTimeout((() => {
        this.scroll.scrollTo({ x: 0, y: offset, animated: false });

        Animated
          .timing(opacity, {
            duration: animationDuration,
            toValue: 1,
          })
          .start();
      }), delay);
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

  isFocused() {
    return this.state.modal;
  }

  selectedIndex() {
    let { data = [] } = this.props;

    return data
      .findIndex(({ value }) => value === this.state.value);
  }

  selectedItem() {
    let { data = [] } = this.props;

    return data
      .find(({ value }) => value === this.state.value);
  }

  itemSize() {
    let { fontSize } = this.props;

    return fontSize * 1.5 + 16;
  }

  visibleItemCount() {
    let { data = [] } = this.props;

    return Math.min(data.length, 4);
  }

  updateRef(name, ref) {
    this[name] = ref;
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
    let { selected } = this.state;

    let {
      data = [],
      textColor,
      itemColor,
      baseColor,
      fontSize,
      animationDuration,
    } = this.props;

    let props = {
      animationDuration,
      baseColor,
      fontSize,
      onPress: this.onSelect,
      style: {
        height: fontSize * 1.5 + 16,
      },
    };

    return data
      .map(({ value }, index) => {
        let color = ~selected?
          index === selected?
            textColor:
            itemColor:
          textColor;

        return (
          <DropdownItem index={index} key={index} {...props}>
            <Text style={{ color, fontSize }}>{value}</Text>
          </DropdownItem>
        );
      });
  }

  render() {
    let { value, left, top, width, opacity, selected, modal } = this.state;
    let { data = [], ...props } = this.props;
    let { fontSize, baseColor, animationDuration } = props;

    let dimensions = Dimensions.get('window');

    let itemCount = data.length;
    let visibleItemCount = this.visibleItemCount();
    let itemSize = this.itemSize();

    let overlayStyle = {
      width: dimensions.width,
      height: dimensions.height,
    };

		let height = 16 + itemSize * visibleItemCount;

    let translateY = -8;

    switch (selected) {
      case -1:
        translateY -= 1 === itemCount? 0 : itemSize;
        break;

      case 0:
        break;

      case itemCount - 1:
      case itemCount - 2:
        let rindex = itemCount - selected;

        translateY -= (visibleItemCount - rindex) * itemSize
        break;

      default:
        translateY -= itemSize;
    }

    let pickerStyle = {
      width,
      height,
      top,
      left,
      opacity,
      transform: [{ translateY }],
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
