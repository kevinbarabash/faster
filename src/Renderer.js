// @flow

import React, {Component} from 'react'

import defaultStyle from './default-style'
import type {Node} from './types'

export default class Renderer extends Component {
    props: {
        data: Node,
    }

    render() {
        const { data } = this.props;
        const style = {
            ...defaultStyle,
            ...data.style,
        };
        const props = ({ style }: any);
        if (data.tag === 'img') {
            props.src = data.src;
        }

        if (Array.isArray(data.children) && data.children.length > 0) {
            return React.createElement(
                data.tag,
                props,
                ...data.children.map((child) => <Renderer data={child} />),
            );
        } else {
            return React.createElement(data.tag, props, data.children);
        }
    }
}
