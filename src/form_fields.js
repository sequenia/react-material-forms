import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles'
import { Grid } from '@material-ui/core'
import NestedModelField from './nested_model_field.js'
import NestedModelsArrayField from './nested_models_array_field.js'

import {
  Checkbox,
  TextField,
  PasswordField,
  SelectField,
  RemoteSelectField,
  PhoneField,
  DateTimeField,
  DecimalField,
  ImageField,
  FileField
} from '@sequenia/react-material-fields'

const styles = (theme) => ({
  root: {},
  component: {},
  formFieldContainer: {
    marginBottom: 20
  }
})

const maxUnits = 12

/**
 * const errorData = { fields: {lastName: "can't be blank"} }
 * const fields = this.fields;
 * return (
 *   <FormFields onChange = { (newItem, field, newValue) => {
 *                 // Some actions
 *               } }
 *               item = { {id: 1, name: "Name"} }
 *               errorData = { errorData }
 *               formFields = { fields } />
 * )
 */
class FormFields extends React.Component {
  constructor(props) {
    super(props)

    this.item = { ...props.item }

    this.delayedForAutoSaveTypes = [
      'text',
      'email',
      'number',
      'password',
      'WYSIWYG'
    ]

    this.state = {}

    this.fieldRefs = {}

    this.onChangeFieldValue = this.onChangeFieldValue.bind(this)
    this.changeValue = this.changeValue.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    return {
      formFields: [...props.formFields],
      errorData: { ...props.errorData },
      readOnly: props.readOnly
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.state.formFields) !==
        JSON.stringify(nextState.formFields) ||
      JSON.stringify(this.state.errorData) !==
        JSON.stringify(nextState.errorData) ||
      this.state.readOnly !== nextState.readOnly
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.item) !== JSON.stringify(prevProps.item)) {
      this.item = { ...this.props.item }
      this.forceUpdate()
    }
  }

  onChangeFieldValue(field, newValue) {
    const { allowAutoSave } = this.props
    if (!allowAutoSave) {
      this.changeValue(field, newValue)
      return
    }

    if (this.delayedForAutoSaveTypes.includes(field.type)) {
      if (this.timeoutToken) {
        clearTimeout(this.timeoutToken)
      }
      this.timeoutToken = setTimeout(() => {
        clearTimeout(this.timeoutToken)
        this.timeoutToken = undefined

        this.changeValue(field, newValue)
      }, this.props.autoSaveTimeout)
    } else {
      this.changeValue(field, newValue)
    }
  }

  changeValue(field, newValue) {
    const { onItemChange } = this.props

    this.item[field.name] = newValue
    if (field.foreignKey) {
      const primaryKey = field.primaryKey || 'id'
      this.item[field.foreignKey] = newValue ? newValue[primaryKey] : null
    }

    if (onItemChange) {
      const newItem = { ...{}, ...this.item }
      onItemChange(newItem, field, newValue)
    }
  }

  formField(field) {
    const {
      autoSaveTimeout,
      allowAutoSave,
      onChange,
      onValueTimeUp
    } = this.props

    const { errorData, readOnly } = this.state
    const { fields: fieldsErrorData = {} } = errorData

    if (field.renderFunction) {
      return field.renderFunction(this.item, field, errorData, onChange)
    }

    const value = this.item[field.name]
    let { name, alternateName } = field
    if (alternateName !== undefined && alternateName !== null) {
      name = alternateName
    }

    if (
      field.type === 'text' ||
      field.type === 'number' ||
      field.type === 'email'
    ) {
      return (
        <TextField
          value={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          errors={fieldsErrorData[field.name]}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'password') {
      return (
        <PasswordField
          value={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          errors={fieldsErrorData[field.name]}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'enum') {
      return (
        <SelectField
          value={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          errors={fieldsErrorData[field.name]}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'dateTime') {
      return (
        <DateTimeField
          value={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          errors={fieldsErrorData[field.name]}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'phone') {
      return (
        <PhoneField
          value={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          errors={fieldsErrorData[field.name]}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'nestedModel') {
      let formFields = []
      if (field.fields) {
        formFields = field.fields(field, value)
      } else if (field.model) {
        formFields = field.model.nestedFormFields(field, { item: value })
      }
      return (
        <NestedModelField
          value={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          autoSaveTimeout={autoSaveTimeout}
          allowAutoSave={allowAutoSave}
          parentField={field}
          formFields={formFields}
          errorData={errorData[field.name]}
          defaultWeight={this.props.defaultWeight}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'nestedModelsArray') {
      let formFields = []
      if (field.fields) {
        formFields = field.fields(field, value)
      } else if (field.model) {
        formFields = field.model.nestedFormFields(field, { item: value })
      }
      const objectErrors = errorData[field.name] || []
      return (
        <NestedModelsArrayField
          values={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          autoSaveTimeout={autoSaveTimeout}
          allowAutoSave={allowAutoSave}
          parentField={field}
          formFields={formFields}
          errors={fieldsErrorData[field.name]}
          objectErrors={objectErrors}
          defaultWeight={field.defaultWeight || this.props.defaultWeight}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'decimal') {
      return (
        <DecimalField
          value={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          errors={fieldsErrorData[field.name]}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'image') {
      return (
        <ImageField
          value={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          errors={fieldsErrorData[field.name]}
          onAutoDelete={() => onValueTimeUp(value)}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'file') {
      return (
        <FileField
          value={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          errors={fieldsErrorData[field.name]}
          onAutoDelete={() => onValueTimeUp(value)}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'model') {
      return (
        <RemoteSelectField
          value={value}
          valueId={this.item[field.foreignKey]}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          errors={fieldsErrorData[field.name]}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    if (field.type === 'boolean') {
      return (
        <Checkbox
          checked={value}
          onChange={(value) => this.onChangeFieldValue(field, value)}
          {...field}
          readOnly={readOnly || field.readOnly}
          name={name}
        />
      )
    }
    return <React.Fragment />
  }

  render() {
    const { classes, className } = this.props

    const { formFields } = this.state

    if (formFields.length === 0) {
      return <React.Fragment />
    }

    return (
      <div className={clsx(classes.root, className)}>
        <Grid container>{this.constructFormFieldsGrid()}</Grid>
      </div>
    )
  }

  constructFormFieldsGrid() {
    const { formFields } = this.state

    const { defaultWeight, classes } = this.props

    if (formFields.length === 0) {
      return <React.Fragment />
    }

    const gridWeb = []
    let remainsUnits = maxUnits
    formFields.forEach((field) => {
      const { weight = defaultWeight, forceNextLine } = field
      let component = this.formField(field)

      if (remainsUnits === 0) {
        remainsUnits = maxUnits
      } else if (remainsUnits < weight) {
        gridWeb.push(
          <Grid item md={remainsUnits} key={`${field.name}_spacer`} />
        )
        remainsUnits = maxUnits
      }

      component = (
        <Grid
          key={field.name}
          item
          md={weight}
          ref={(ref) => {
            this.fieldRefs[field.name] = ref
          }}
        >
          <div className={classes.component}>{component}</div>
        </Grid>
      )
      gridWeb.push(component)
      remainsUnits = remainsUnits - weight
      if (forceNextLine) {
        gridWeb.push(
          <Grid item md={remainsUnits} key={`${field.name}_spacer`} />
        )
        remainsUnits = 0
      }
    })
    return gridWeb
  }
}

FormFields.propTypes = {
  formFields: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  errorData: PropTypes.object,
  onItemChange: PropTypes.func,
  autoSaveTimeout: PropTypes.number,
  allowAutoSave: PropTypes.bool,
  defaultWeight: PropTypes.number,
  readOnly: PropTypes.bool
}

FormFields.defaultProps = {
  autoSaveTimeout: 500,
  allowAutoSave: false,
  defaultWeight: 12,
  readOnly: false
}

export default withStyles(
  (theme) => ({
    ...styles(theme)
  }),
  { withTheme: true }
)(FormFields)
