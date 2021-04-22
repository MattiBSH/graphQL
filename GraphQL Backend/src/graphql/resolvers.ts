import FriendFacade from '../facades/friendFacade';
import { IFriend } from '../interfaces/IFriend';
import { ApiError } from '../errors/errors';
import { Request } from "express";



let friendFacade: FriendFacade;

/*
We don't have access to app or the Router so we need to set up the facade in another way
In www.ts IMPORT and CALL the method below, like so: 
      setupFacade(db);
Just before the line where you start the server
*/
export function setupFacade(db: any) {
  if (!friendFacade) {
    friendFacade = new FriendFacade(db)
  }
}

// resolver map
export const resolvers = {
  Query: {

    getAllFriends: (root: any, _: any, context: any) => {
      
      /* if (!context.credentials.role || context.credentials.role !== "admin") {
        throw new ApiError("Not Authorized", 401)
      } */
     
      return friendFacade.getAllFriends()

    },
    
      getFriend: async (root: any,{input}:{input:string}) => {
       /*  if (!context.credentials.role || context.credentials.role !== "admin") {
          throw new ApiError("Not Authorized", 401)
        } */
       
        return friendFacade.getFriendFromEmail(input)
      }
  },
  Mutation: {
    createFriend: async (_: object, { input }: { input: IFriend }) => {
      return friendFacade.addFriendV2(input)
    },
    editFriend: async (_: object, { input }: { input: IFriend },root: any, context: any) => {
      /* if (!context.credentials.role || context.credentials.role !== "admin") {
        throw new ApiError("Not Authorized", 401)
      } */
        return friendFacade.editFriendV2(input.email,input);
      },
      deleteFriend: async (  email:  string ,root: any, context: any) => {
        /* if (!context.credentials.role || context.credentials.role !== "admin") {
          throw new ApiError("Not Authorized", 401)
        } */
        return friendFacade.deleteFriend(email)
      }
  
}
};