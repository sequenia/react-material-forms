// https://github.com/STRML/react-grid-layout
import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'

import uuidv4 from 'uuid/v4'
import { FormLabel } from '@material-ui/core'

import RGL, { WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'

import { compose } from 'recompose'
import withHelperText from './hocs/with_helper_text.js'

import Button from './buttons/button.js'
import NestedModelsArrayItem from './nested_models_array_item.js'
const ReactGridLayout = WidthProvider(RGL)

const ModelArrayContext = React.createContext()

const AddTypeAuto = 'auto'
const AddTypeManual = 'manual'

const styles = (theme) => ({
  root: {},
  grid: {
    margin: '0px -12px'
  },
  addContainer: {},
  addButton: {
    padding: '7px 10px',
    minWidth: '125px',
    fontSize: '18px'
  }
})

class NestedModelsArrayField extends React.Component {
  constructor(props) {
    super(props)
    const { values = [] } = props

    this.values = this.prepareItems(values)

    this.metrics = {}
    this.onChangeValuesCount()
    this.state = {
      layout: this.layoutByValues()
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      parentField: { ...props.parentField },
      formFields: [...props.formFields],
      objectErrors: [...props.objectErrors],
      readOnly: props.readOnly
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.state.layout) !== JSON.stringify(nextState.layout) ||
      JSON.stringify(this.state.formFields) !==
        JSON.stringify(nextState.formFields) ||
      JSON.stringify(this.state.parentField) !==
        JSON.stringify(nextState.parentField) ||
      JSON.stringify(this.state.objectErrors) !==
        JSON.stringify(nextState.objectErrors) ||
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height ||
      this.props.hasError !== nextProps.hasError ||
      this.state.readOnly !== nextState.readOnly ||
      JSON.stringify(this.props.values) !== JSON.stringify(nextProps.values)
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(this.props.values) !== JSON.stringify(prevProps.values)
    ) {
      const { values = [] } = this.props
      this.values = this.prepareItems(values)
      this.forceUpdate()
    }
  }

  onAdd = (newValue = undefined) => {
    if (Array.isArray(newValue)) {
      this.onAddItems(newValue)
    } else {
      this.onAddItem(newValue)
    }
  }

  onAddItem = (newItem = undefined) => {
    const { onChange } = this.props

    const { defaultItem } = this.props
    const item = newItem || { ...defaultItem(this.values), default: true }
    this.values.push(item)

    this.onChangeValuesCount()
    this.updateLayout()

    if (onChange) {
      onChange(this.valuesToSendUp())
    }
  }

  onAddItems = (newItems) => {
    const { onChange } = this.props
    this.values = this.values.concat(newItems)

    this.onChangeValuesCount()
    this.updateLayout()

    if (onChange) {
      onChange(this.valuesToSendUp())
    }
  }

  onChangeItem = (changedItem) => {
    const { onChange } = this.props
    const index = this.values.findIndex(
      (val) => val.clientId === changedItem.clientId
    )
    this.values[index] = { ...changedItem, default: false }

    if (onChange) {
      onChange(this.valuesToSendUp())
    }

    if (this.isAutoAddType() && changedItem.default) {
      this.onAddItem()
    }
  }

  onDeleteItem = (value) => {
    const { onChange } = this.props

    const index = this.values.findIndex(
      (val) => val.clientId === value.clientId
    )

    delete this.metrics[value.clientId]

    this.values.splice(index, 1)

    this.onChangeValuesCount()
    this.updateLayout()
    this.forceUpdate()

    if (onChange) {
      onChange(this.valuesToSendUp())
    }
  }

  onUpdateItemMetrics = (key, width, height) => {
    this.metrics[key] = {
      width: width,
      height: height
    }
    this.updateLayout()
  }

  onUpdateLayout = (layout) => {
    const { onChange } = this.props

    ;[...layout]
      .sort((a, b) => {
        return a.y - b.y || a.x - b.x
      })
      .forEach((layoutItem, index) => {
        const val = this.valuesHash[layoutItem.i]
        if (val) {
          val.position = index
        }
      })
    this.values = this.values.sort((a, b) => a.position - b.position)

    this.updateLayout()

    if (onChange) {
      onChange(this.valuesToSendUp())
    }
  }

  onValueTimeUp = (value) => {
    this.onDeleteItem(value)
  }

  valuesToSendUp() {
    if (this.isManualAddType()) {
      return this.values
    } else {
      return this.values.filter((value) => !value.default)
    }
  }

  prepareItems(items) {
    return [...items].map((item) => {
      if (item.clientId) {
        return { ...item }
      }
      return {
        ...item,
        clientId: uuidv4()
      }
    })
  }

  isManualAddType() {
    return this.props.addType === AddTypeManual
  }

  isAutoAddType() {
    return this.props.addType === AddTypeAuto
  }

  onChangeValuesCount = () => {
    this.valuesHash = {}
    this.values.forEach((val) => {
      this.valuesHash[val.clientId] = val
    })
  }

  layoutByValues = () => {
    const { defaultWeight, maxWeight, rowHeight, parentField } = this.props
    const { itemWeight = defaultWeight } = parentField

    const colsCount = maxWeight / itemWeight

    let x = -1
    let y = 0
    const layout = this.values.map((item) => {
      x += 1
      if (x >= colsCount) {
        x = 0
        y += 1
      }

      let h = 1
      const metric = this.metrics[item.clientId] || {}
      if (metric.height) {
        h = Math.ceil(metric.height / rowHeight)
      }
      return {
        i: item.clientId,
        x: x,
        y: y,
        w: 1,
        h: h,
        static: false
      }
    })
    return layout
  }

  updateLayout = () => {
    this.setState({
      layout: this.layoutByValues()
    })
  }

  render() {
    const {
      classes,
      className,
      defaultWeight,
      maxWeight,
      rowHeight,
      defaultItem,
      addButtonFunc,
      hasError
    } = this.props

    const { formFields, objectErrors = [], parentField, readOnly } = this.state

    const { addText, autoSaveTimeout, allowAutoSave, displayName } = this.props

    const {
      allowDragDrop,
      allowDelete,
      itemWeight = defaultWeight
    } = parentField

    const colsCount = maxWeight / itemWeight

    let x = -1
    let y = 0
    const layout = this.values.map((item) => {
      x += 1
      if (x >= colsCount) {
        x = 0
        y += 1
      }

      let h = 1
      const metric = this.metrics[item.clientId] || {}
      if (metric.height) {
        h = Math.ceil(metric.height / rowHeight)
      }
      return {
        i: item.clientId,
        x: x,
        y: y,
        w: 1,
        h: h,
        static: false
      }
    })

    return (
      <ModelArrayContext.Provider
        value={{
          onValueTimeUp: this.onValueTimeUp
        }}
      >
        <div className={clsx(classes.root, className)}>
          {displayName && displayName !== '' && (
            <FormLabel error={hasError}>{displayName}</FormLabel>
          )}
          <ReactGridLayout
            cols={colsCount}
            className={clsx(classes.grid, 'layout')}
            rowHeight={rowHeight}
            isResizable={false}
            isDraggable={allowDragDrop}
            layout={layout}
            key={this.gridKey}
            margin={[0, 0]}
            containerPadding={[0, 0]}
            onLayoutChange={this.onUpdateLayout}
          >
            {this.values.map((item) => {
              const errorData =
                objectErrors.filter(
                  (obj) => item.clientId === obj.clientId || item.id === obj.id
                )[0] || {}
              return (
                <div key={item.clientId}>
                  <NestedModelsArrayItem
                    key={item.clientId}
                    parentField={parentField}
                    formFields={formFields}
                    allowDelete={
                      (!item.default || this.isManualAddType()) && allowDelete
                    }
                    item={item}
                    onChange={this.onChangeItem}
                    onDelete={() => this.onDeleteItem(item)}
                    onUpdateDimensions={(width, height) =>
                      this.onUpdateItemMetrics(item.clientId, width, height)
                    }
                    errorData={errorData}
                    autoSaveTimeout={autoSaveTimeout}
                    allowAutoSave={allowAutoSave}
                    readOnly={readOnly}
                  />
                </div>
              )
            })}
          </ReactGridLayout>
          {addButtonFunc &&
            addButtonFunc(this.values, defaultItem, this.onAdd, hasError)}
          {!addButtonFunc && this.isManualAddType() && (
            <div className={classes.addContainer}>
              <Button
                className={classes.addButton}
                onClick={() => this.onAdd()}
              >
                {addText}
              </Button>
            </div>
          )}
        </div>
      </ModelArrayContext.Provider>
    )
  }
}

NestedModelsArrayField.propTypes = {
  addText: PropTypes.string,
  formFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  parentField: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,

  autoSaveTimeout: PropTypes.number,
  allowAutoSave: PropTypes.bool,
  addType: PropTypes.oneOf([AddTypeManual, AddTypeAuto])
}

NestedModelsArrayField.defaultProps = {
  addText: 'Add',
  autoSaveTimeout: 500,
  allowAutoSave: false,
  defaultWeight: 12,
  maxWeight: 12,
  addType: AddTypeManual,
  rowHeight: 5
}

export default compose(
  withHelperText,
  withStyles(styles)
)(NestedModelsArrayField)
export { AddTypeManual, AddTypeAuto, ModelArrayContext }
