import { gql } from "@apollo/client";

export const GET_ALL_SERVICES = gql`
  query getAllServices {
    getServices {
      id
      name
      img
    }
  }
`;