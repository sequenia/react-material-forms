import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'
import { compose } from 'recompose'

import withHelperText from './hocs/with_helper_text.js'

import { FormLabel } from '@material-ui/core'

import FormFields from './form_fields.js'

const styles = (theme) => ({
  root: {}
})

class NestedModelField extends React.Component {
  constructor(props) {
    super(props)

    this.value = { ...{}, ...props.value }

    this.state = {}

    this.onChangeNestedModel = this.onChangeNestedModel.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    return {
      parentField: { ...props.parentField },
      formFields: [...props.formFields],
      errorData: { ...props.errorData },
      readOnly: props.readOnly
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.state.formFields) !==
        JSON.stringify(nextState.formFields) ||
      JSON.stringify(this.state.parentField) !==
        JSON.stringify(nextState.parentField) ||
      JSON.stringify(this.state.errorData) !==
        JSON.stringify(nextState.errorData) ||
      this.state.readOnly !== nextState.readOnly
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(this.value || {}) !== JSON.stringify(prevProps.value || {})
    ) {
      this.value = {
        ...this.props.value
      }
      this.forceUpdate()
    }
  }

  onChangeNestedModel(changedItem) {
    const { onChange } = this.props
    this.value = { ...changedItem }
    if (onChange) {
      onChange(changedItem)
    }
  }

  render() {
    const {
      classes,
      className,
      autoSaveTimeout,
      allowAutoSave,
      displayName
    } = this.props

    const { formFields, errorData, readOnly } = this.state

    return (
      <div className={clsx(classes.root, className)}>
        {displayName && displayName !== '' && (
          <FormLabel>{displayName}</FormLabel>
        )}
        {
          <FormFields
            formFields={formFields}
            item={this.value}
            onItemChange={this.onChangeNestedModel}
            errorData={errorData}
            autoSaveTimeout={autoSaveTimeout}
            allowAutoSave={allowAutoSave}
            defaultWeight={this.props.defaultWeight}
            readOnly={readOnly}
          />
        }
      </div>
    )
  }
}

NestedModelField.propTypes = {
  formFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  parentField: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,

  autoSaveTimeout: PropTypes.number,
  allowAutoSave: PropTypes.bool,
  value: PropTypes.object
}

NestedModelField.defaultProps = {
  autoSaveTimeout: 500,
  allowAutoSave: false,
  defaultWeight: 12
}

export default compose(withHelperText, withStyles(styles))(NestedModelField)
