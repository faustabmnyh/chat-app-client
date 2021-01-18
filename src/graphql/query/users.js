import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query register($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      token
    }
  }
`;

export const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      createdAt
      imageURL
      latestMessage {
        content
        from
        to
      }
    }
  }
`;
