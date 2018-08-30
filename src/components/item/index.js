import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, TouchableNativeFeedback } from 'react-native';

import styles from './styles';

export default class DropdownItem extends PureComponent {
    static defaultProps = {
        color: 'transparent',
        disabledColor: 'transparent',
        shadeBorderRadius: 0,
    };

    static propTypes = {
        index: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
    }

    onPress = () => {
        let { onPress, index } = this.props;

        if ('function' === typeof onPress) {
            onPress(index);
        }
    };

    render() {
        let { children, style, index, ...props } = this.props;

        return (
            <TouchableNativeFeedback {...props} onPress={this.onPress}>
                <View style={[styles.container, style]}>{children}</View>
            </TouchableNativeFeedback>
        );
    }
}
