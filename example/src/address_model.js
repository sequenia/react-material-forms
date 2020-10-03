import DescribingModel from '@sequenia/describing-model';

const countriesEnum = [
  {
    key: "USA",
    value: "usa"
  },
  {
    key: "France",
    value: "france"
  },
  {
    key: "Germany",
    value: "germany"
  }    
];

class Address extends DescribingModel {
  formFields(item = undefined) {
    return [
      {
        name: "country",
        displayName: "Country",
        type: "enum",
        data: countriesEnum
      },
      {
        name: "city",
        displayName: "City",
        type: "text",
      },
      {
        name: "postalCode",
        displayName: "Postal code",
        type: "text",
      },
      {
        name: "street",
        displayName: "Street",
        type: "text",
      },
      {
        name: "number",
        displayName: "Number",
        type: "text",
      },
      {
        name: "url",
        displayName: "URL",
        type: "text",
      },
    ]
  }
}

const AddressModel = new Address()
export default AddressModel