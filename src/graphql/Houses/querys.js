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

export const GETHOUSE = gql`
  query($id: ID!) {
    getHouse(id: $id) {
      id
      homenumber
      street
      sity
      payments {
        id
      }
      citizens {
        id
      }
    }
  }
`

// MUTATIONS *****************

export const ADDHOUSE = gql`
  mutation($sity: String!, $street: String!, $homenumber: String!) {
    addHouse(sity: $sity, street: $street, homenumber: $homenumber) {
      homenumber
      id
      street
      sity
    }
  }
`

export const EDITHOUSE = gql`
  mutation($id: ID!, $sity: String!, $street: String!, $homenumber: String!) {
    editHouse(id: $id, sity: $sity, street: $street, homenumber: $homenumber) {
      id
      homenumber
      street
      sity
    }
  }
`

export const DELHOUSE = gql`
  mutation($id: ID!) {
    delHouse(id: $id) {
      id
      homenumber
      street
      sity
    }
  }
`
