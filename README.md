# @sequenia/react-material-forms

> form blocks based on @sequenia/react-material-fields

[![NPM](https://img.shields.io/npm/v/@sequenia/react-material-forms.svg)](https://www.npmjs.com/package/@sequenia/react-material-forms) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo
https://sequenia.github.io/react-material-forms/

## Requirements

React v16.0.0 and above, @material-ui/core v4.9.0 and above, @sequenia/describing-model v0.0.2 and above

## Install

```bash
npm install --save @sequenia/react-material-forms
```

## Usage

```jsx
import FormFields from '@sequenia/react-material-forms';
import DescribingModel from '@sequenia/describing-model';
import AddressModel from './address_model.js';
import CompanyPersonModel from './company_person_model.js';
import uuidv4 from 'uuid/v4';


const salutationEnum = [
  {
    key: "Mr",
    value: "mr"
  },
  {
    key: "Ms",
    value: "ms"
  },
  {
    key: "Mrs",
    value: "mrs"
  }    
];

const errorDataExample = {
  fields: {
    birthPlace: ["can't be blank"]
  } 
}

const personalItems = {
  salutation: "mr",
  firstName: "John",
  lastName: "Doe",
  birthDate: "01-12-1985",
  manager: "",
  address: {
    country: "",
    city: "",
    postalCode: "",
    street: "",
    number: "",
    url: ""
  }
}

class PersonalInfoModel extends DescribingModel {


  formFields(item = undefined) {
    return [
        {
          name: "salutation",
          displayName: "Salutation",
          displayNamePosition: "above",
          type: "enum",
          data: salutationEnum,
          forceNextLine: true,
          weight: 6
        },
        {
          name: "firstName",
          displayName: "First name",
          displayNamePosition: "above",
          type: "text",
          weight: 6
        },
        {
          name: "lastName",
          displayName: "Last name",
          displayNamePosition: "above",
          type: "text",
          weight: 6
        },
        {
          name: "birthDate",
          displayName: "Birth date",
          displayNamePosition: "above",
          type: "dateTime",
          format: "DD.MM.YYYY",
          weight: 6
        },
        {
          name: "birthPlace",
          displayName: "Birth place",
          displayNamePosition: "above",
          type: "text",
          weight: 6
        },
        {
          name: "manager",
          displayName: "Select your manager",
          displayNamePosition: "above",
          type: "model",
          allowClear: true,
          clearItem: "No manager",
          optionDisplayName: option => {
            const { first_name, last_name } = option;
            return `${first_name} ${last_name}`; 
          },
          downloader: (searchQuery, selectedValueIds) => {
            const params = {
              query: searchQuery,
              valueIds: selectedValueIds
            }
            const url = new URL("https://reqres.in/api/users");
            Object.keys(params).forEach(key => url.searchParams.append(key, encodeURIComponent(params[key])));
            return fetch(url)
                  .then((response) => response.json())
                  .then((response) => {
                    const { data } = response;
                    return data;
                  });  
          },
          weight: 6,
          forceNextLine: true
        },
        {
          name: "address",
          type: "nestedModel",
          weight: 12,
          fields: (parentField, item) => AddressModel.formFields({item}),
        },
        {
          name: "people",
          type: "nestedModelsArray",
          weight: 12,
          itemWeight: 12,
          addText: "Add company person",
          defaultWeight: 6,
          allowDragDrop: false,
          allowDelete: true,
          fields: (parentField, item) => {
            return CompanyPersonModel.formFields({item: item});
          },
          defaultItem: (items) => {
            return {
              clientId: uuidv4(),
            }
          }
        },
    ]
  }
}
 
const PersonalInfoModelInstance = new PersonalInfoModel();

const App = () => {
  return  <div className = "container">
    <h1>React Material Form</h1>
    <p>Form blocks based on @sequenia/react-material-fields</p>
    <section className = "section">
      <h3>Simple model FormFields</h3>
      <FormFields formFields = { PersonalInfoModelInstance.formFields() } 
                  errorData = { errorDataExample }
                  item = { personalItems } />
    </section>
  </div> 
}

```

## License

MIT © [sequenia](https://github.com/sequenia)
