// @flow
import React, {Children, Component} from 'react'

import defaultStyle from './default-style'
import type {Node} from './types'
import store from './store'

const swatchStyle = {
    display: 'inline-block',
    width: 12,
    height: 12,
    marginRight: 3,
    marginTop: 3,
    borderRadius: 2,
};

const Swatch = ({ color }) => <div
    style={{ ...swatchStyle, backgroundColor: color }}
/>;

const values = {
    flexDirection: ['column', 'column-reverse', 'row', 'row-reverse'],
    alignItems: ['flex-start', 'flex-end', 'center', 'space-around', 'space-between'],
    justifyContent: ['flex-start', 'flex-end', 'center', 'space-around', 'space-between'],
}

const units = ['em', 'ex', '%', 'px', 'cm', 'mm', 'in', 'pt', 'pc'];

const parseLength = (str) => {

}

type Length = {
    value: number,
    unit: 'em' | 'ex' | '%' | 'px' | 'cm' | 'mm' | 'in' | 'pt' | 'pc',
}

// What's the source of truth?
// We could have a struct for these values and always update that
const shorthand = {
    flex: {
        children: ['flexGrow', 'flexShrink', 'flexBasis'],
        // TODO(kevinb) validator function
        // TODO(kevinb) generate short hand from children
        // TODO(kevinb) generate children from editing shorthand
    },

    margin: {
        children: [''],
        toShorthand: (top, right, bottom, left) => `${top}px ${right}px ${bottom}px ${right}px`,
        toLonghand: (shorthand) => {
            const [top, right, bottom, left] = shorthand.split(' ').map(parseFloat);
            return {top, right, bottom, left};
        },
    }
}

const groups = {
    flex: [
        'flexDirection', 'flex', 'justifyContent', 'alignItems',
    ],
    dim: [
        'margin', 'padding',
    ],
}

class SmallButton extends Component {
    props: {
        children?: Children,
    }

    state = {
        hovered: false,
    }

    render() {
        return <div
            onMouseEnter={() => this.setState({hovered: true})}
            onMouseLeave={() => this.setState({hovered: false})}
            style={{
                display: 'inline-block',
                padding: `2px 4px`,
                borderRadius: 4,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: this.state.hovered ? 'gray' : 'lightgray',
                fontFamily: 'sans-serif',
                color: this.state.hovered ? 'gray' : 'lightgray',
                fontSize: 13,
                marginRight: 4,
                cursor: this.state.hovered ? 'pointer' : 'initial',
            }}
        >
            {this.props.children}
        </div>;
    }
}

const lengthRegex = /(em|ex|%|px|cm|mm|in|pt|pc)$/
const colorRegex = /color/i

const validate = (name, value: string) => {
    if (colorRegex.test(name)) {
        return true;
    } else {
        return lengthRegex.test(value);
    }
}

// TODO create different specialized editors for colors, dropdowns, compound values, etc.
class Editor extends Component {
    props: {
        children?: Children,
        name: string,
        value: any,
    }

    dirty: boolean
    initialValue: string
    node: HTMLElement

    handleBlur = () => {
        if (this.dirty) {
            const value = this.node.innerText || '';
            const name = this.props.name;

            if (value === '') {
                store.dispatch({
                    type: 'DELETE',
                    name: name,
                })
            } else if (validate(name, value)) {
                store.dispatch({
                    type: 'UPDATE',
                    name: name,
                    value: value,
                })
            } else {
                this.node.innerText = this.initialValue;
            }
        }

        this.dirty = false
    }

    handleFocus = () => {
        this.dirty = false
        if (this.node) {
            this.initialValue = this.node.innerText || ''
        }
    }

    handleChange = () => {
        this.dirty = true
        const value = this.node.innerText || ''
        const name = this.props.name

        if (validate(name, value)) {
            store.dispatch({
                type: 'UPDATE',
                name: name,
                value: value,
            });
        }
    }

    shouldComponentUpdate(newProps) {
        return newProps.value !== (this.node.innerText || '');
    }

    render() {
        const isColor = /color/i.test(this.props.name)

        const style = {
            whiteSpace: 'nowrap',
            paddingLeft: isColor ? 20 : 0,
        }

        return <div
            contentEditable={true}
            style={style}
            ref={node => this.node = node}
            onBlur={this.handleBlur}
            onInput={this.handleChange}
            onFocus={this.handleFocus}
        >
            {this.props.children}
        </div>;
    }
}

export default class Inspector extends Component {
    props: {
        data: Node,
    }

    formatValue(key: string, value: any) {
        if (typeof value === 'number') {
            // TODO(kevinb) handle more units
            const str = `${value}px`;
            return <Editor name={key} value={str}>{str}</Editor>;
        } else if (key in values) {
            return <select>
                {values[key].map((value) => <option key={value} value={value}>
                    {value}
                </option>)}
            </select>;
        } else {
            return <Editor name={key} value={value}>{value}</Editor>;
        }
    }

    render() {
        const { data } = this.props;

        const style = {
            ...defaultStyle,
            ...data.style,
        }

        // TODO(kevinb) split this into rendered and editors
        // When focusing a cell we render the editor
        // When bluring a cell we validate, update if valid, and render the viewer
        return <div style={{ width: 300 }}>
            <SmallButton>flex</SmallButton>
            <SmallButton>dim</SmallButton>
            <SmallButton>border</SmallButton>
            <SmallButton>text</SmallButton>
            <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%', marginTop: 8 }}>
                <tbody>
                    {Object.keys(style).sort().map(key => {
                        const value = style[key]
                        const isColor = /color/i.test(key)

                        return <tr key={key} style={{ color: defaultStyle[key] !== value ? 'black' : '#AAA' }}>
                            <td style={{ fontFamily: 'monospace', paddingRight: 16, border: 'solid 1px #CCC', padding: '2px 4px'}}>{key}</td>
                            <td style={{ alignItems: 'center', position: 'relative', fontFamily: 'monospace', border: 'solid 1px #CCC', padding: '2px 4px'}}>
                                {isColor && <span style={{position: 'absolute', top: 0, left: 8}}> <Swatch color={value} /></span>}
                                {this.formatValue(key, value)}
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    }
}
