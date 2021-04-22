import { Friends } from './dbConnectors';

// resolver map
export const resolvers = {
  Query: {
    getFriend: (root, { id }) => {
      return Friends.findById(id);
    },
  },
  Mutation: {
    createFriend: async (root, { input }) => {
      const newFriend = new Friends({
        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender,
        email: input.email
      });
      return newFriend.save()
    },
  },
};
