import React from 'react'
import { FormHelperText } from '@material-ui/core'

const WithHelperText = (Component) => {
  class WithHelperText extends React.Component {
    constructor(props) {
      super(props)

      this.helperText = this.helperText.bind(this)

      this.state = {}
    }

    static getDerivedStateFromProps(props, state) {
      const {
        errors = [],
        descriptionText,
        descriptionComponentFunc,
        required,
        displayName
      } = props
      const errorsText = errors.filter((err) => {
        return typeof err === 'string'
      })
      return {
        errorMessage: errorsText.length > 0 ? errorsText.join(', ') : undefined,
        descriptionText: descriptionText,
        descriptionComponentFunc: descriptionComponentFunc,
        hasError: errorsText.length > 0 || props.hasError,
        displayName: displayName,
        required: required
      }
    }

    displayName() {
      const { required, displayName } = this.state

      if (displayName === undefined) {
        return undefined
      }

      return `${displayName}${required ? ' *' : ''}`
    }

    helperText() {
      const {
        hasError,
        errorMessage,
        descriptionText,
        descriptionComponentFunc
      } = this.state
      return (
        <React.Fragment>
          {errorMessage && (
            <FormHelperText error={hasError}>{errorMessage}</FormHelperText>
          )}
          {descriptionText &&
            descriptionComponentFunc &&
            descriptionComponentFunc(descriptionText)}
          {descriptionText && !descriptionComponentFunc && (
            <FormHelperText>{descriptionText}</FormHelperText>
          )}
        </React.Fragment>
      )
    }

    render() {
      const { hasError } = this.state
      return (
        <React.Fragment>
          <Component
            {...this.props}
            hasError={hasError}
            displayName={this.displayName()}
          />
          {this.helperText()}
        </React.Fragment>
      )
    }
  }

  return WithHelperText
}

export default WithHelperText
