import gql from 'graphql-tag'

// QUERYS **********

export const ALLPAYMENTS = gql`
  query {
    getAllPayments {
      id
      dateOfPayments
      summ
      quarter
      year
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

export const GETPAYMENTBYID = gql`
  query($id: ID!) {
    getPayment(id: $id) {
      dateOfPayments
      summ
      quarter
      year
      citizenId {
        id
      }
      houseId {
        id
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
    $year: Int!
  ) {
    editPayment(
      id: $id
      dateOfPayments: $dateOfPayments
      summ: $summ
      quarter: $quarter
      citizenId: $citizenId
      houseId: $houseId
      year: $year
    ) {
      id
      dateOfPayments
      summ
      quarter
      year
      citizenId {
        id
      }
      houseId {
        id
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
    $year: Int!
  ) {
    addPayment(
      dateOfPayments: $dateOfPayments
      summ: $summ
      quarter: $quarter
      citizenId: $citizenId
      houseId: $houseId
      year: $year
    ) {
      id
      dateOfPayments
      summ
      quarter
      year
      citizenId {
        id
        name
      }
      houseId {
        id
        homenumber
        sity
        street
      }
    }
  }
`
