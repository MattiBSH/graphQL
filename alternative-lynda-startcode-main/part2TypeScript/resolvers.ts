interface IContact {
  firstName: string
  lastName: string
}

interface IFriend {
  firstName: string,
  lastName: string,
  gender: string,
  age: number,
  language: string,
  email: string,
  contacts: IContact[]
}

class Friend implements IFriend {
  id: number;
  firstName: string
  lastName: string
  gender: string
  age: number
  language: string
  email: string
  contacts: IContact[]

  constructor(id: number, friend: IFriend) {
    this.id = id;
    this.firstName = friend.firstName
    this.lastName = friend.lastName
    this.gender = friend.gender
    this.age = friend.age
    this.language = friend.language
    this.email = friend.email
    this.contacts = friend.contacts
  }
}
const friendDatabase: { [key: string]: IFriend } = {};

// resolver map
export const resolvers = {
  Query: {
    //https://www.mdeditor.tw/pl/2uMr
    getFriend: (_: object, { id }: { id: number }) => {
      return new Friend(id, friendDatabase[id]);
    }
  },
  Mutation: {
    createFriend: (_: object, { input }: { input: IFriend }) => {
      let id = require('crypto').randomBytes(10).toString('hex');
      friendDatabase[id] = new Friend(id, input);
      return new Friend(id, input);
    },
  },
};
