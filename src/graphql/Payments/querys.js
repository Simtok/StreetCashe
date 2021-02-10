import gql from 'graphql-tag'

// QUERYS **********

export const ALLPAYMENTS = gql`
  query {
    getAllPayments {
      id
      dateOfPayments
      summ
      quarter
      citizenId {
        id
        name
      }
      houseId {
        id
        homenumber
        street
        sity
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
  mutation(
    $id: ID!
    $dateOfPayments: String!
    $summ: String!
    $quarter: String!
    $citizenId: ID!
    $houseId: ID!
  ) {
    editPayment(
      id: $id
      dateOfPayments: $dateOfPayments
      summ: $summ
      quarter: $quarter
      citizenId: $citizenId
      houseId: $houseId
    ) {
      id
      dateOfPayments
      summ
      quarter
      citizenId {
        id
        name
      }
      houseId {
        id
        housenumber
        street
        sity
      }
    }
  }
`

export const ADDPAYMENT = gql`
  mutation(
    $dateOfPayments: String!
    $summ: String!
    $quarter: String!
    $citizenId: ID!
    $houseId: ID!
  ) {
    addPayment(
      dateOfPayments: $dateOfPayments
      summ: $summ
      quarter: $quarter
      citizenId: $citizenId
      houseId: $houseId
    ) {
      id
      dateOfPayments
      summ
      quarter
      citizenId {
        id
        name
      }
      houseId {
        id
        housenumber
        street
        sity
      }
    }
  }
`
