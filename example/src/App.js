import React from 'react'

import FormFields from '@sequenia/react-material-forms';
import DescribingModel from '@sequenia/describing-model';

class SomeModel extends DescribingModel {
 
  displayName(item) {
    return `${item.type} - ${item.name}`;
  }
 
  listCells(items = undefined) {
    return [
      {
        name: "type",
        displayName: "Model's type",
        type: "enum",
        data: [
          {
            key: "simple",
            value: "Simple"
          },
          {
            key: "extended",
            value: "Extended"
          },
          {
            key: "user_defined",
            value: "User defined"
          }
        ]
      },
      {
        name: "name",
        displayName: "Name",
        type: "text",
        sortKey: "name"
      }
    ]
  }
 
  formFields(item = undefined) {
    return [
      {
        name: "type",
        displayName: "Model's type",
        type: "enum",
        data: [
          {
            key: "simple",
            value: "Simple"
          },
          {
            key: "extended",
            value: "Extended"
          },
          {
            key: "user_defined",
            value: "User defined"
          }
        ],
        required: true
      },
      {
        name: "name",
        displayName: "Name",
        type: "text"
      }
    ]
  }
}
 
const SomeModelInstance = new SomeModel();

const App = () => {
  return <FormFields formFields = { SomeModelInstance.formFields() } 
  item = { { name: "test" } } />
}

export default App
