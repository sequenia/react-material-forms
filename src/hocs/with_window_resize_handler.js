import React from 'react'

const WithWindowResizeHandler = (Component) => {
  class WithWindowResizeHandler extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        width: 0,
        height: 0
      }
    }

    updateDimensions = () => {
      if (!this.component) {
        return
      }

      const { clientWidth: width, clientHeight: height } = this.component

      this.setState({
        width: width,
        height: height
      })
    }

    componentDidMount() {
      this.updateDimensions()
      window.addEventListener('resize', this.updateDimensions)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateDimensions)
    }

    componentDidUpdate(prevProps, prevState) {
      const { onUpdateDimensions } = this.props
      const { width, height } = this.state

      if (onUpdateDimensions) {
        onUpdateDimensions(width, height)
      }
    }

    isNode = (o) => {
      return typeof Node === 'object'
        ? o instanceof Node
        : o &&
            typeof o === 'object' &&
            typeof o.nodeType === 'number' &&
            typeof o.nodeName === 'string'
    }

    // Returns true if it is a DOM element
    isElement = (o) => {
      return typeof HTMLElement === 'object'
        ? o instanceof HTMLElement // DOM2
        : o &&
            typeof o === 'object' &&
            o !== null &&
            o.nodeType === 1 &&
            typeof o.nodeName === 'string'
    }

    render() {
      const { width, height } = this.state
      return (
        <Component
          {...this.props}
          ref={(ref) => (this.component = ref)}
          width={width}
          height={height}
          updateDimensions={this.updateDimensions}
        />
      )
    }
  }

  return WithWindowResizeHandler
}

export default WithWindowResizeHandler
