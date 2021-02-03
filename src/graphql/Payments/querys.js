import gql from 'graphql-tag'

// QUERYS **********

export const ALLPAYMENTS = gql`
  query {
    getAllPayments {
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

// MUTATIONS *********

export const DELPAYMENT = gql`
  mutation($id: ID!) {
    delPayment(id: $id) {
      id
      dateOfPayments
      summ
    }
  }
`

export const EDITPAYMENT = gql`
  mutation($id: ID!, $dateOfPayments: String!, $summ: String!, $citizenId: ID!) {
    editPayment(id: $id, dateOfPayments: $dateOfPayments, summ: $summ, citizenId: $citizenId) {
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

export const ADDPAYMENT = gql`
  mutation($dateOfPayments: String!, $summ: String!, $citizenId: ID!) {
    addPayment(dateOfPayments: $dateOfPayments, summ: $summ, citizenId: $citizenId) {
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
