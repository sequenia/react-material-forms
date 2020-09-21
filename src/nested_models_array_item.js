import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'

import { IconButton } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'

import { compose } from 'recompose'
import withWindowResizeHandler from './hocs/with_window_resize_handler.js'

import FormFields from './form_fields.js'
import { ModelArrayContext } from './nested_models_array_field.js'

const styles = (theme) => ({
  root: {
    display: 'block',
    padding: '12px',
    position: 'relative'
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  fieldsContainer: {
    flexGrow: 1
  },
  deleteButton: {
    marginLeft: '10px'
  }
})

class NestedModelsArrayItem extends React.Component {
  constructor(props) {
    super(props)

    this.item = { ...props.item }

    this.state = {}
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
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height ||
      this.state.readOnly !== nextState.readOnly
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(this.state.errorData) !==
      JSON.stringify(prevState.errorData)
    ) {
      const { updateDimensions } = this.props
      updateDimensions()
    }
  }

  onChangeItem = (changedItem) => {
    const { onChange, updateDimensions } = this.props
    this.value = { ...changedItem }

    updateDimensions()
    if (onChange) {
      onChange(this.value)
    }
  }

  onDeleteItem = () => {
    const { onDelete } = this.props
    if (onDelete) {
      onDelete()
    }
  }

  render() {
    const { classes, allowDelete, className, innerRef } = this.props

    const { autoSaveTimeout, allowAutoSave } = this.props

    const { formFields, errorData, readOnly } = this.state

    return (
      <ModelArrayContext.Consumer>
        {(context) => (
          <div className={clsx(classes.root, className)} ref={innerRef}>
            <div className={classes.itemContainer}>
              <div className={classes.fieldsContainer}>
                <FormFields
                  formFields={formFields}
                  item={this.item}
                  onItemChange={this.onChangeItem}
                  errorData={errorData}
                  autoSaveTimeout={autoSaveTimeout}
                  allowAutoSave={allowAutoSave}
                  onValueTimeUp={context.onValueTimeUp}
                  readOnly={readOnly}
                />
              </div>
              {allowDelete && (
                <IconButton
                  className={classes.deleteButton}
                  onClick={this.onDeleteItem}
                >
                  <ClearIcon />
                </IconButton>
              )}
            </div>
          </div>
        )}
      </ModelArrayContext.Consumer>
    )
  }
}

NestedModelsArrayItem.propTypes = {
  formFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  parentField: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,

  autoSaveTimeout: PropTypes.number,
  allowAutoSave: PropTypes.bool
}

NestedModelsArrayItem.defaultProps = {
  autoSaveTimeout: 500,
  allowAutoSave: false,
  defaultWeight: 12,
  maxWeight: 12
}

const ForwardedRef = React.forwardRef((props, ref) => (
  <NestedModelsArrayItem innerRef={ref} {...props} />
))

export default compose(
  withWindowResizeHandler,
  withStyles(styles)
)(ForwardedRef)
