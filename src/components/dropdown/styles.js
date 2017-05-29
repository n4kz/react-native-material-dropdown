import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  accessory: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  triangle: {
    width: 8,
    height: 8,
    transform: [{
      translateY: -4,
    }, {
      rotate: '45deg',
    }],
  },

  triangleContainer: {
    width: 12,
    height: 6,
    overflow: 'hidden',
    alignItems: 'center',

    backgroundColor: 'transparent', /* XXX: Required */
  },

  picker: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 2,
    minHeight: 36 + 16,
    maxHeight: (36 * 5) + 16 - 24,

    position: 'absolute',

    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowColor: 'rgba(0, 0, 0, 1.0)',
        shadowOpacity: 0.54,
        shadowOffset: { width: 0, height: 2 },
      },

      android: {
        elevation: 2,
      },
    }),

    transform: [{
      translateY: -36 - 8,
    }],
  },

  scroll: {
    flex: 1,
    borderRadius: 2,
  },

  scrollContainer: {
    paddingVertical: 8,
  },

  item: {
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 0,
    justifyContent: 'center',
  },
});
