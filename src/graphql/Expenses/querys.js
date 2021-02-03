import gql from 'graphql-tag'

// QUERYS **********

export const ALLEXPENSES = gql`
  query {
    getAllExpense {
      id
      name
      dateOfExpenditure
      summOfExpenditure
    }
  }
`

export const GETEXPENSEBYID = gql`
  query($id: ID!) {
    getExpense(id: $id) {
      name
      dateOfExpenditure
      summOfExpenditure
    }
  }
`

// MUTATIONS *********

export const EDITEXPENSEBYID = gql`
  mutation($id: ID!, $name: String!, $dateOfExpenditure: String!, $summOfExpenditure: String!) {
    editExpense(
      id: $id
      name: $name
      dateOfExpenditure: $dateOfExpenditure
      summOfExpenditure: $summOfExpenditure
    ) {
      id
      name
      dateOfExpenditure
      summOfExpenditure
    }
  }
`
export const ADDEXPENSE = gql`
  mutation($name: String!, $dateOfExpenditure: String!, $summOfExpenditure: String!) {
    addExpense(
      name: $name
      dateOfExpenditure: $dateOfExpenditure
      summOfExpenditure: $summOfExpenditure
    ) {
      id
      name
      dateOfExpenditure
      summOfExpenditure
    }
  }
`

export const DELEXPENSEBYID = gql`
  mutation($id: ID!) {
    delExpense(id: $id) {
      id
      name
      dateOfExpenditure
      summOfExpenditure
    }
  }
`
