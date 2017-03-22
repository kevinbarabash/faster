// @flow
import {createStore} from 'redux'

// TODO(kevinb) in the UI allow @name to reference constants like colors and such

// TODO(kevinb) have different palettes that you can switch between for flex,
// margin, padding, border, font, colors, etc.

const typography = {
  subheading: {
    fontFamily: 'sans-serif',
    fontSize: 23,
    fontWeight: 'bold',
  },
  body: {
    fontFamily: 'sans-serif',
    fontSize: 16,
    fontWeight: 'normal', // dedupe from defaultStyles
  },
};

const initialState = {
  tag: 'div',
  style: {
    width: 300,
    height: 100,
    justifyContent: 'flex-start',
    backgroundColor: 'pink',
    borderRadius: 4,
    borderStyle: 'solid',
    borderColor: 'gray',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',

    // TODO(kevinb) figure out how to apply this to only the first item
    marginTop: 16,
  },
  children: [
    {
      tag: 'img',
      style: {
        height: 64,
        width: 64,
      },
      src: 'http://placekitten.com/g/64/64',
    },
    {
      tag: 'div',
      style: {
        marginLeft: 12,
      },
      children: [
        {
          tag: 'div',
          style: {
            ...typography.subheading,
          },
          children: `Hello, world`, // TODO: how to inject props
        },
        {
          tag: 'div',
          style: {
            ...typography.body,
            marginTop: 4,
          },
          children: 'Meow!',
        },
      ]
    }
  ],
}

// TODO(kevinb) figure out how to modify the number of cards shown
// const layout = (names) => ({
//     tag: 'div',
//     style: {
//     },
//     // TODO(kevinb) need a way to provide a mapping to create each of the props object
//     children: names.map((name) => card({ name: name })),
// })

// const names = ['tabby', 'caleco', 'alley', 'blue', 'siamese'];


const lengthRegex = /(em|ex|%|px|cm|mm|in|pt|pc)$/
const colorRegex = /[Cc]olor/

const validate = (name, value) => {
  if (colorRegex.test(name)) {
    return true;
  } else {
    return lengthRegex.test(value);
  }
}

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case 'UPDATE':
      if (validate(action.name, action.value)) {
        return {
          ...state,
          style: {
            ...state.style,
            [action.name]: action.value,
          },
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}

export default createStore(reducer, initialState)
