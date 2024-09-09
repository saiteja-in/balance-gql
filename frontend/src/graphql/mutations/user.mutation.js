import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signup(input: $input) {
      _id
      name
      username
    }
  }
`;
