// @flow

// TODO(kevinb) parse this type to generate drop downs and validators for UI
export type Style = {
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

export type Node = {
    tag: string,
    style: Style,
    src?: string,
    children?: Node[] | string,
}
