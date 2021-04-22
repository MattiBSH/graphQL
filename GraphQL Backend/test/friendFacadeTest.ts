import * as mongo from "mongodb"
import FriendFacade from '../src/facades/friendFacade';

import chai from "chai";
const expect = chai.expect;

//use these two lines for more streamlined tests of promise operations
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import bcryptjs from "bcryptjs"
import { InMemoryDbConnector } from "../src/config/dbConnector"
import { ApiError } from "../src/errors/errors";
import { error } from "winston";

let friendCollection: mongo.Collection;
let facade: FriendFacade;

describe("## Verify the Friends Facade ##", () => {

  before(async function () {
    const client = await InMemoryDbConnector.connect();
    const db =client.db();
    
    friendCollection=db.collection("friends");
    facade=new FriendFacade(db);
  })

  beforeEach(async () => {
    const hashedPW = await bcryptjs.hash("secret", 4)
    await friendCollection.deleteMany({})
    
    //Create a few few testusers for ALL the tests
    await friendCollection.insertMany([
      {firstName:"Peter",lastName:"Pan",email:"pp@b.dk",password:hashedPW, role:"user"},
      {firstName:"Donald",lastName:"Duck",email:"dd@b.dk",password:hashedPW, role:"user"}])

      
  })

  describe("Verify the addFriend method", () => {
    it("It should Add the user Jan", async () => {
      const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret" }
      const status = await facade.addFriend(newFriend);
      expect(status).to.be.not.null
      const jan = await friendCollection.findOne({ email: "jan@b.dk" })
      expect(jan.firstName).to.be.equal("Jan")
    })

    it("It should not add a user with a role (validation fails)", async () => {
      const newFriend1 = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret",role:"admin" }
      const status = await facade.addFriend(newFriend1).catch(error);
      expect(ApiError);
      
     
    })
  })

  describe("Verify the editFriend method", () => {
    it("It should change lastName to XXXX", async () => {
      const newFriend={firstName:"XXXX",lastName:"Pan",email:"pp@b.dk",password:"secret"};
      const status=await facade.editFriend("pp@b.dk",newFriend);
      expect(status.modifiedCount).to.equal(1);
      const xxxx = await friendCollection.findOne({ email: "pp@b.dk" })
      //expect(xxxx.firstName).to.be.equal("XXXX")
    })
  })

  describe("Verify the deleteFriend method", () => {
    it("It should remove the user Peter", async () => {
      let s=await facade.deleteFriend("pp@b.dk");
      const jan = await friendCollection.findOne({ email: "pp@b.dk" })

      expect(jan==[]);
    })
    it("It should return false, for a user that does not exist", async () => {
      const s=await facade.deleteFriend("we@b.dk");
      expect(s==false);
    })
  })

  describe("Verify the getAllFriends method", () => {
    it("It should get two friends", async () => {
      const all=await facade.getAllFriends();
      expect(all.length==2);
    })
  })

  describe("Verify the getFriend method", () => {

    it("It should find Donald Duck", async () => {
      let dd=await facade.getFrind("dd@b.dk");
      expect(dd.firstName=="Donald Duck");
    })
    it("It should not find xxx.@.b.dk", async () => {
      let dd=await facade.getFrind("xxx.@.b.dk").catch(error);
      expect(error);
    })
  })

  describe("Verify the getVerifiedUser method", () => {
    it("It should correctly validate Peter Pan's credential,s", async () => {
      const veriefiedPeter = await facade.getVerifiedUser("pp@b.dk", "secret")
      expect(veriefiedPeter).to.be.not.null;
    })

    it("It should NOT validate Peter Pan's credential,s", async () => {
      const veriefiedPeter = await facade.getVerifiedUser("pp@b.dk", "equalsrightforallhumans").catch(error);
      expect(ApiError);
    })

    it("It should NOT validate a non-existing users credentials", async () => {
      const veriefiedPeter = await facade.getVerifiedUser("petererendumdum@b.dk", "equalsrightforallhumans").catch(error);
      expect(ApiError);
    })
  })

})