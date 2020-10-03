import React from 'react'

import "./index.css";
import FormFields from '@sequenia/react-material-forms';
import DescribingModel from '@sequenia/describing-model';
import AddressModel from './address_model.js';

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
    console.log(AddressModel.formFields({item: item}));
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
        }
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
    <section className = "section">
      <h3>Nested model field</h3>
    </section>
  </div> 
}

export default App
