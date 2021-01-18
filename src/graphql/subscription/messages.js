import { gql } from "@apollo/client";

export const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      content
      createdAt
      to
    }
  }
`;

export const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid
      content
      message {
        uuid
        from
        to
      }
    }
  }
`;
