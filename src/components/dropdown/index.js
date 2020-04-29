import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Text,
  View,
  FlatList,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ViewPropTypes,
  I18nManager,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { TextField } from 'react-native-material-textfield';

import DropdownItem from '../item';
import styles from './styles';

export default class Dropdown extends PureComponent {
  static defaultProps = {
    hitSlop: { top: 6, right: 4, bottom: 6, left: 4 },

    disabled: false,

    data: [],

    valueExtractor: ({ value } = {}, index) => value,
    labelExtractor: ({ label } = {}, index) => label,
    propsExtractor: () => null,

    absoluteRTLLayout: false,

    dropdownOffset: {
      top: 32,
      left: 0,
    },

    dropdownMargins: {
      min: 8,
      max: 16,
    },

    rippleCentered: false,
    rippleSequential: true,

    rippleInsets: {
      top: 16,
      right: 0,
      bottom: -8,
      left: 0,
    },

    rippleOpacity: 0.54,
    shadeOpacity: 0.12,

    rippleDuration: 400,
    animationDuration: 225,

    fontSize: 16,

    textColor: 'rgba(0, 0, 0, .87)',
    itemColor: 'rgba(0, 0, 0, .54)',
    baseColor: 'rgba(0, 0, 0, .38)',

    itemCount: 4,
    itemPadding: 8,

    supportedOrientations: [
      'portrait',
      'portrait-upside-down',
      'landscape',
      'landscape-left',
      'landscape-right',
    ],

    useNativeDriver: false,
  };

  static propTypes = {
    ...TouchableWithoutFeedback.propTypes,

    disabled: PropTypes.bool,

    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    data: PropTypes.arrayOf(PropTypes.object),

    valueExtractor: PropTypes.func,
    labelExtractor: PropTypes.func,
    propsExtractor: PropTypes.func,

    absoluteRTLLayout: PropTypes.bool,

    dropdownOffset: PropTypes.shape({
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
    }),

    dropdownMargins: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }),

    dropdownPosition: PropTypes.number,

    rippleColor: PropTypes.string,
    rippleCentered: PropTypes.bool,
    rippleSequential: PropTypes.bool,

    rippleInsets: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),

    rippleOpacity: PropTypes.number,
    shadeOpacity: PropTypes.number,

    rippleDuration: PropTypes.number,
    animationDuration: PropTypes.number,

    fontSize: PropTypes.number,

    textColor: PropTypes.string,
    itemColor: PropTypes.string,
    selectedItemColor: PropTypes.string,
    disabledItemColor: PropTypes.string,
    baseColor: PropTypes.string,

    itemTextStyle: Text.propTypes.style,

    itemCount: PropTypes.number,
    itemPadding: PropTypes.number,

    onLayout: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,

    renderBase: PropTypes.func,
    renderAccessory: PropTypes.func,

    containerStyle: (ViewPropTypes || View.propTypes).style,
    overlayStyle: (ViewPropTypes || View.propTypes).style,
    pickerStyle: (ViewPropTypes || View.propTypes).style,

    supportedOrientations: PropTypes.arrayOf(PropTypes.string),

    useNativeDriver: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onLayout = this.onLayout.bind(this);

    this.updateRippleRef = this.updateRef.bind(this, 'ripple');
    this.updateContainerRef = this.updateRef.bind(this, 'container');
    this.updateScrollRef = this.updateRef.bind(this, 'scroll');

    this.renderAccessory = this.renderAccessory.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.keyExtractor = this.keyExtractor.bind(this);

    this.blur = () => this.onClose();
    this.focus = this.onPress;

    let { value } = this.props;

    this.mounted = false;
    this.focused = false;

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

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onPress(event) {
    let {
      data,
      disabled,
      onFocus,
      itemPadding,
      rippleDuration,
      dropdownOffset,
      dropdownMargins: { min: minMargin, max: maxMargin },
      animationDuration,
      absoluteRTLLayout,
      useNativeDriver,
    } = this.props;

    if (disabled) {
      return;
    }

    let itemCount = data.length;
    let timestamp = Date.now();

    if (null != event) {
      /* Adjust event location */
      event.nativeEvent.locationY -= this.rippleInsets().top;
      event.nativeEvent.locationX -= this.rippleInsets().left;

      /* Start ripple directly from event */
      this.ripple.startRipple(event);
    }

    if (!itemCount) {
      return;
    }

    this.focused = true;

    if ('function' === typeof onFocus) {
      onFocus();
    }

    let dimensions = Dimensions.get('window');

    this.container.measureInWindow((x, y, containerWidth, containerHeight) => {
      let { opacity } = this.state;

      /* Adjust coordinates for relative layout in RTL locale */
      if (I18nManager.isRTL && !absoluteRTLLayout) {
        x = dimensions.width - (x + containerWidth);
      }

      let delay = Math.max(0, rippleDuration - animationDuration - (Date.now() - timestamp));
      let selected = this.selectedIndex();

      let leftInset;
      let left = x
        + dropdownOffset.left
        - maxMargin;

      if (left > minMargin) {
        leftInset = maxMargin;
      } else {
        left = minMargin;
        leftInset = minMargin;
      }

      let right = x + containerWidth + maxMargin;
      let rightInset;

      if (dimensions.width - right > minMargin) {
        rightInset = maxMargin;
      } else {
        right = dimensions.width - minMargin;
        rightInset = minMargin;
      }

      let top = y
        + dropdownOffset.top
        - itemPadding;

      this.setState({
        modal: true,
        width: right - left,
        top,
        left,
        leftInset,
        rightInset,
        selected,
      });

      setTimeout((() => {
        if (this.mounted) {
          this.resetScrollOffset();

          Animated
            .timing(opacity, {
              duration: animationDuration,
              toValue: 1,
              useNativeDriver,
            })
            .start(() => {
              if (this.mounted && 'ios' === Platform.OS) {
                let { flashScrollIndicators } = this.scroll || {};

                if ('function' === typeof flashScrollIndicators) {
                  flashScrollIndicators.call(this.scroll);
                }
              }
            });
        }
      }), delay);
    });
  }

  onClose(value = this.state.value) {
    let { onBlur, animationDuration, useNativeDriver } = this.props;
    let { opacity } = this.state;

    Animated
      .timing(opacity, {
        duration: animationDuration,
        toValue: 0,
        useNativeDriver,
      })
      .start(() => {
        this.focused = false;

        if ('function' === typeof onBlur) {
          onBlur();
        }

        if (this.mounted) {
          this.setState({ value, modal: false });
        }
      });
  }

  onSelect(index) {
    let {
      data,
      valueExtractor,
      onChangeText,
      animationDuration,
      rippleDuration,
    } = this.props;

    let value = valueExtractor(data[index], index);
    let delay = Math.max(0, rippleDuration - animationDuration);

    if ('function' === typeof onChangeText) {
      onChangeText(value, index, data);
    }

    setTimeout(() => this.onClose(value), delay);
  }

  onLayout(event) {
    let { onLayout } = this.props;

    if ('function' === typeof onLayout) {
      onLayout(event);
    }
  }

  value() {
    let { value } = this.state;

    return value;
  }

  selectedIndex() {
    let { value } = this.state;
    let { data, valueExtractor } = this.props;

    return data
      .findIndex((item, index) => null != item && value === valueExtractor(item, index));
  }

  selectedItem() {
    let { data } = this.props;

    return data[this.selectedIndex()];
  }

  isFocused() {
    return this.focused;
  }

  itemSize() {
    let { fontSize, itemPadding } = this.props;

    return Math.ceil(fontSize * 1.5 + itemPadding * 2);
  }

  visibleItemCount() {
    let { data, itemCount } = this.props;

    return Math.min(data.length, itemCount);
  }

  tailItemCount() {
    return Math.max(this.visibleItemCount() - 2, 0);
  }

  rippleInsets() {
    let {
      top = 16,
      right = 0,
      bottom = -8,
      left = 0,
    } = this.props.rippleInsets || {};

    return { top, right, bottom, left };
  }

  resetScrollOffset() {
    let { selected } = this.state;
    let { data, dropdownPosition } = this.props;

    let offset = 0;
    let itemCount = data.length;
    let itemSize = this.itemSize();
    let tailItemCount = this.tailItemCount();
    let visibleItemCount = this.visibleItemCount();

    if (itemCount > visibleItemCount) {
      if (null == dropdownPosition) {
        switch (selected) {
          case -1:
            break;

          case 0:
          case 1:
            break;

          default:
            if (selected >= itemCount - tailItemCount) {
              offset = itemSize * (itemCount - visibleItemCount);
            } else {
              offset = itemSize * (selected - 1);
            }
        }
      } else {
        let index = selected - dropdownPosition;

        if (dropdownPosition < 0) {
          index -= visibleItemCount;
        }

        index = Math.max(0, index);
        index = Math.min(index, itemCount - visibleItemCount);

        if (~selected) {
          offset = itemSize * index;
        }
      }
    }

    if (this.scroll) {
      this.scroll.scrollToOffset({ offset, animated: false });
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  keyExtractor(item, index) {
    let { valueExtractor } = this.props;

    return `${index}-${valueExtractor(item, index)}`;
  }

  renderBase(props) {
    let { value } = this.state;
    let {
      data,
      renderBase,
      labelExtractor,
      dropdownOffset,
      renderAccessory = this.renderAccessory,
    } = this.props;

    let index = this.selectedIndex();
    let title;

    if (~index) {
      title = labelExtractor(data[index], index);
    }

    if (null == title) {
      title = value;
    }

    if ('function' === typeof renderBase) {
      return renderBase({ ...props, title, value, renderAccessory });
    }

    title = null == title || 'string' === typeof title?
      title:
      String(title);

    return (
      <TextField
        label=''
        labelHeight={dropdownOffset.top - Platform.select({ ios: 1, android: 2 })}

        {...props}

        value={title}
        editable={false}
        onChangeText={undefined}
        renderAccessory={renderAccessory}
      />
    );
  }

  renderRipple() {
    let {
      baseColor,
      rippleColor = baseColor,
      rippleOpacity,
      rippleDuration,
      rippleCentered,
      rippleSequential,
    } = this.props;

    let { bottom, ...insets } = this.rippleInsets();
    let style = {
      ...insets,

      height: this.itemSize() - bottom,
      position: 'absolute',
    };

    return (
      <Ripple
        style={style}
        rippleColor={rippleColor}
        rippleDuration={rippleDuration}
        rippleOpacity={rippleOpacity}
        rippleCentered={rippleCentered}
        rippleSequential={rippleSequential}
        ref={this.updateRippleRef}
      />
    );
  }

  renderAccessory() {
    let { baseColor: backgroundColor } = this.props;
    let triangleStyle = { backgroundColor };

    return (
      <View style={styles.accessory}>
        <View style={styles.triangleContainer}>
          <View style={[styles.triangle, triangleStyle]} />
        </View>
      </View>
    );
  }

  renderItem({ item, index }) {
    if (null == item) {
      return null;
    }

    let { selected, leftInset, rightInset } = this.state;

    let {
      valueExtractor,
      labelExtractor,
      propsExtractor,
      textColor,
      itemColor,
      baseColor,
      selectedItemColor = textColor,
      disabledItemColor = baseColor,
      fontSize,
      itemTextStyle,
      rippleOpacity,
      rippleDuration,
      shadeOpacity,
    } = this.props;

    let props = propsExtractor(item, index);

    let { style, disabled }
      = props
      = {
        rippleDuration,
        rippleOpacity,
        rippleColor: baseColor,

        shadeColor: baseColor,
        shadeOpacity,

        ...props,

        onPress: this.onSelect,
      };

    let value = valueExtractor(item, index);
    let label = labelExtractor(item, index);

    let title = null == label?
      value:
      label;

    let color = disabled?
      disabledItemColor:
      ~selected?
        index === selected?
          selectedItemColor:
          itemColor:
        selectedItemColor;

    let textStyle = { color, fontSize };

    props.style = [
      style,
      {
        height: this.itemSize(),
        paddingLeft: leftInset,
        paddingRight: rightInset,
      },
    ];

    return (
      <DropdownItem index={index} {...props}>
        <Text style={[styles.item, itemTextStyle, textStyle]} numberOfLines={1}>
          {title}
        </Text>
      </DropdownItem>
    );
  }

  render() {
    let {
      renderBase,
      renderAccessory,
      containerStyle,
      overlayStyle: overlayStyleOverrides,
      pickerStyle: pickerStyleOverrides,

      rippleInsets,
      rippleOpacity,
      rippleCentered,
      rippleSequential,

      hitSlop,
      pressRetentionOffset,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,

      supportedOrientations,

      ...props
    } = this.props;

    let {
      data,
      disabled,
      itemPadding,
      dropdownPosition,
    } = props;

    let { left, top, width, opacity, selected, modal } = this.state;

    let itemCount = data.length;
    let visibleItemCount = this.visibleItemCount();
    let tailItemCount = this.tailItemCount();
    let itemSize = this.itemSize();

    let height = 2 * itemPadding + itemSize * visibleItemCount;
    let translateY = -itemPadding;

    if (null == dropdownPosition) {
      switch (selected) {
        case -1:
          translateY -= 1 === itemCount? 0 : itemSize;
          break;

        case 0:
          break;

        default:
          if (selected >= itemCount - tailItemCount) {
            translateY -= itemSize * (visibleItemCount - (itemCount - selected));
          } else {
            translateY -= itemSize;
          }
      }
    } else {
      if (dropdownPosition < 0) {
        translateY -= itemSize * (visibleItemCount + dropdownPosition);
      } else {
        translateY -= itemSize * dropdownPosition;
      }
    }

    let overlayStyle = { opacity };

    let pickerStyle = {
      width,
      height,
      top,
      left,
      transform: [{ translateY }],
    };

    let touchableProps = {
      disabled,
      hitSlop,
      pressRetentionOffset,
      onPress: this.onPress,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,
    };

    return (
      <View onLayout={this.onLayout} ref={this.updateContainerRef} style={containerStyle}>
        <TouchableWithoutFeedback {...touchableProps}>
          <View pointerEvents='box-only'>
            {this.renderBase(props)}
            {this.renderRipple()}
          </View>
        </TouchableWithoutFeedback>

        <Modal
          visible={modal}
          transparent={true}
          onRequestClose={this.blur}
          supportedOrientations={supportedOrientations}
        >
          <Animated.View
            style={[styles.overlay, overlayStyle, overlayStyleOverrides]}
            onStartShouldSetResponder={() => true}
            onResponderRelease={this.blur}
          >
            <View
              style={[styles.picker, pickerStyle, pickerStyleOverrides]}
              onStartShouldSetResponder={() => true}
            >
              <FlatList
                ref={this.updateScrollRef}
                data={data}
                style={styles.scroll}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                scrollEnabled={visibleItemCount < itemCount}
                contentContainerStyle={styles.scrollContainer}
              />
            </View>
          </Animated.View>
        </Modal>
      </View>
    );
  }
}
