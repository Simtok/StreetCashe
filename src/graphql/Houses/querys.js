import gql from 'graphql-tag'

// QUERYS **********

export const ALLHOUSES = gql`
  query {
    getAllHouses {
      id
      homenumber
      street
      sity
    }
  }
`
