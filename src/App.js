// @flow

import React, { Component } from 'react'

// TODO(kevinb) in the UI allow @name to reference constants like colors and such

// TODO(kevinb) have different palettes that you can switch between for flex,
// margin, padding, border, font, colors, etc.

// TODO(kevinb) parse this type to generate drop downs and validators for UI
type Style = {
  width?: number,
  height?: number,
  backgroundColor?: string,

  flexGrow?: number,
  flexShrink?: number,

  alignItems?: 'flex-start' | 'flex-end' | 'center',
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-around' | 'space-between',

  // TODO(kevinb): figure out how to represent shorthand
  margin?: number,
  marginTop?: number,
  marginRight?: number,
  marginBottom?: number,
  marginLeft?: number,

  padding?: number,
  paddingTop?: number,
  paddingRight?: number,
  paddingBottom?: number,
  paddingLeft?: number,

  borderRadius?: number,
  borderTopLeftRadius?: number,
  borderTopRightRadius?: number,
  borderBottomRightRadius?: number,
  borderBottomLeftRadius?: number,

  borderWidth?: number,
  borderColor?: string,
  borderStyle?: 'solid' | 'none',

  fontSize?: number,
  fontFamily?: string,
  fontWeight?: 'normal' | 'bold' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  textDecoration?: 'underline' | 'strikethrough' | 'none',
}

type Node = {
  tag: string,
  style: Style,
  src?: string,
  children?: Node[] | string,
}

const defaultStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',

  borderStyle: 'none',
  borderWidth: 1,

  boxSizing: 'border-box',

  fontWeight: 'normal',
}

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

const card = (props) => ({
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
          children: `Hello, ${props.name}`,
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
})

// TODO(kevinb) figure out how to modify the number of cards shown
const layout = (names) => ({
  tag: 'div',
  style: {

  },
  // TODO(kevinb) need a way to provide a mapping to create each of the props object
  children: names.map((name) => card({name: name})),
})

class Renderer extends Component {
  props: {
    data: Node,
  }

  render() {
    const {data} = this.props;
    const style = {
      ...defaultStyle,
      ...data.style,
    };
    const props = ({style}: any);
    if (data.tag === 'img') {
      props.src = data.src;
    }

    if (Array.isArray(data.children) && data.children.length > 0) {
      return React.createElement(
        data.tag,
        props,
        ...data.children.map((child) => <Renderer data={child}/>),
      );
    } else {
      return React.createElement(data.tag, props, data.children);
    }
  }
}

const names = ['tabby', 'caleco', 'alley', 'blue', 'siamese'];

class App extends Component {
  render() {
    return <div>
      <h1>faster test page</h1>
      <Renderer data={layout(names)}/>
    </div>
  }
}

export default App;
