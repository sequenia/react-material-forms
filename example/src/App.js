import React from 'react'

import "./index.css";
import FormFields from '@sequenia/react-material-forms';
import DescribingModel from '@sequenia/describing-model';

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
  birthDate: "01-12-1985"
}

class PersonalInfoModel extends DescribingModel {
 
  formFields(item = undefined) {
    return [
        {
          name: "salutation",
          displayName: "Salutation",
          type: "enum",
          data: salutationEnum,
          forceNextLine: true,
          weight: 6
        },
        {
          name: "firstName",
          displayName: "First name",
          type: "text",
          weight: 6
        },
        {
          name: "lastName",
          displayName: "Last name",
          type: "text",
          weight: 6
        },
        {
          name: "birthDate",
          displayName: "Birth date",
          type: "dateTime",
          format: "DD.MM.YYYY",
          weight: 6
        },
        {
          name: "birthPlace",
          displayName: "Birth place",
          type: "text",
          weight: 6
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
      <FormFields formFields = { PersonalInfoModelInstance.formFields() } 
                  errorData = { errorDataExample }
                  item = { personalItems } />
    </section>
  </div> 
}

export default App
