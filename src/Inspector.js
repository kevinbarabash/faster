// @flow
import React, {Component} from 'react'

import defaultStyle from './default-style'
import type {Node} from './types'

const Swatch = ({ color }) => <div style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: color, marginRight: 2, borderRadius: 2 }} />;

export default class Inspector extends Component {
    props: {
        data: Node,
    }

    formatValue(value: any) {
        if (typeof value === 'number') {
            return `${value}px`;  // TODO(kevinb) handle more units
        } else {
            return value;
        }
    }

    render() {
        const { data } = this.props;

        const style = {
            ...defaultStyle,
            ...data.style,
        }

        return <div style={{ width: 300 }}>
            <table>
                <tbody>
                    {Object.keys(style).sort().map(key => {
                        const value = style[key]
                        const isColor = /color/i.test(key)

                        return <tr style={{ color: defaultStyle[key] !== value ? 'black' : '#AAA' }}>
                            <td style={{ fontFamily: 'monospace', paddingRight: 16 }}>{key}</td>
                            <td style={{ display: 'flex', alignItems: 'center', fontFamily: 'monospace' }}>
                                {isColor && <Swatch color={value} />}
                                {this.formatValue(value)}
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    }
}
