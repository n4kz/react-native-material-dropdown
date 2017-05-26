import { StyleSheet } from 'react-native';

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
    backgroundColor: 'white',
    borderRadius: 2,
    minHeight: 36 + 16,
    maxHeight: (36 * 5) + 16 - 24,

    position: 'absolute',

    shadowColor: 'rgb(0, 0, 0)',
    shadowOpacity: 0.54,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,

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

  text: {
    fontSize: 16,
  },
});
