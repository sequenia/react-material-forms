import DescribingModel from '@sequenia/describing-model';

class CompanyPerson extends DescribingModel {
  formFields(item = undefined) {
    return [
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
    ]
  }
}

const CompanyPersonModel = new CompanyPerson()
export default CompanyPersonModel