import gql from 'graphql-tag'

// QUERYS **********

export const ALLCITIZENS = gql`
  query {
    getAllCitizen {
      id
      name
      address
      phone
    }
  }
`

export const GETCITIZENPAYS = gql`
  query($id: ID!) {
    getCitizenWithPays(id: $id) {
      payments {
        id
        dateOfPayments
        summ
      }
    }
  }
`
export const GETCITIZEN = gql`
  query($id: ID!) {
    getPayWithCitizen(id: $id) {
      id
      dateOfPayments
      summ
      citizenId {
        id
        name
        address
      }
    }
  }
`

export const GETCITIZENBYID = gql`
  query($id: ID!) {
    getCitizen(id: $id) {
      name
      address
      phone
    }
  }
`

// MUTATIONS *********

export const EDITCITIZENBYID = gql`
  mutation($id: ID!, $name: String, $address: String, $phone: String) {
    editCitizen(id: $id, name: $name, address: $address, phone: $phone) {
      id
      name
      address
      phone
    }
  }
`

export const ADDCITIZEN = gql`
  mutation($name: String, $address: String, $phone: String) {
    addCitizen(name: $name, address: $address, phone: $phone) {
      id
      name
      address
      phone
    }
  }
`
export const DELCITIZENBYID = gql`
  mutation($id: ID!) {
    delCitizen(id: $id) {
      id
      name
      address
      phone
    }
  }
`
