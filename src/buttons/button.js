import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'
import { Button as MaterialButton } from '@material-ui/core'

import {
  ButtonVariantContained,
  ButtonVariantText,
  ButtonVariantOutlined
} from './constants.js'

const styles = (theme) => ({
  root: {}
})

const ButtonTypeButton = 'button'
const ButtonTypeSubmit = 'submit'

class Button extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static getDerivedStateFromProps(props, state) {
    return {
      disabled: props.disabled
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.disabled !== nextState.disabled ||
      this.props.className !== nextProps.className
    )
  }

  render() {
    const {
      classes,
      className,
      labelClass,
      variant,
      component,
      startIcon,
      ariaControls,
      ariaHaspopup
    } = this.props

    const { type, onClick, children } = this.props

    const { disabled } = this.state

    const additionalClasses = {}
    if (labelClass) {
      additionalClasses.label = labelClass
    }

    return (
      <MaterialButton
        className={clsx(classes.root, className)}
        classes={additionalClasses}
        disabled={disabled}
        variant={variant}
        component={component}
        type={type}
        startIcon={startIcon}
        onClick={onClick}
        aria-controls={ariaControls}
        aria-haspopup={ariaHaspopup}
      >
        {children}
      </MaterialButton>
    )
  }
}

Button.propTypes = {
  className: PropTypes.string,
  labelClass: PropTypes.string,
  type: PropTypes.oneOf([ButtonTypeButton, ButtonTypeSubmit]),
  variant: PropTypes.oneOf([
    ButtonVariantContained,
    ButtonVariantText,
    ButtonVariantOutlined
  ]),
  component: PropTypes.string,
  startIcon: PropTypes.node,
  ariaHaspopup: PropTypes.bool,
  ariaControls: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
}

Button.defaultProps = {
  type: ButtonTypeButton,
  variant: ButtonVariantContained,
  ariaHaspopup: false,
  disabled: false
}

const styledButton = withStyles(styles)(Button)
export default styledButton
