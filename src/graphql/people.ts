import { gql } from "@apollo/client";

export const GET_ALL_RENTALS = gql`
  query getAllRentals {
    getCategories {
      id
      name
      type
    }
  }
`;

