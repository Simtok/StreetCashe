import gql from 'graphql-tag'

// QUERYS **********

export const ALLCITIZENS = gql`
  query {
    getAllCitizen {
      id
      name
      birthday
      phone
      payments {
        summ
        dateOfPayments
      }
      houseId {
        homenumber
        street
        sity
      }
    }
  }
`

export const GETCITIZENBYID = gql`
  query($id: ID!) {
    getCitizen(id: $id) {
      name
      birthday
      phone
    }
  }
`

// MUTATIONS *********

export const EDITCITIZENBYID = gql`
  mutation($id: ID!, $name: String, $phone: String, $birthday: String, $houseId: ID!) {
    editCitizen(id: $id, name: $name, phone: $phone, birthday: $birthday, houseId: $houseId) {
      id
      name
      birthday
      phone
    }
  }
`

export const ADDCITIZEN = gql`
  mutation($name: String, $phone: String, $birthday: String, $houseId: ID!) {
    addCitizen(name: $name, phone: $phone, birthday: $birthday, houseId: $houseId) {
      id
      name
      birthday
      phone
    }
  }
`
export const DELCITIZENBYID = gql`
  mutation($id: ID!) {
    delCitizen(id: $id) {
      id
      name
    }
  }
`
