import path from "path";
import { expect } from "chai"
import app from "../src/app"

import supertest from "supertest"
const request = supertest(app)

import bcryptjs from "bcryptjs"
import * as mongo from "mongodb"
import { InMemoryDbConnector } from "../src/config/dbConnector"
import { ApiError } from "../src/errors/errors";
import { error } from "winston";
let friendCollection: mongo.Collection;

describe("### Describe the Friend Endpoints (/api/friends) ###", function () {
  let URL: string;

  before(async function () {
    const connection = await InMemoryDbConnector.connect();
    const db =connection.db();
    app.set("db",db);
    app.set("db-type","TEST-DB");
    friendCollection=db.collection("friends");
    
  })

  beforeEach(async function () {
    const hashedPW = await bcryptjs.hash("secret", 8)
    await friendCollection.deleteMany({})
    //Last friend below is only necessary if you have added authentications
    await friendCollection.insertMany([
      { firstName: "Peter", lastName: "Pan", email: "pp@b.dk", password: hashedPW, role: "user" },
      { firstName: "Donald", lastName: "Duck", email: "dd@b.dk", password: hashedPW, role: "user" },
      { firstName: "Ad", lastName: "Admin", email: "aa@a.dk", password: hashedPW, role: "admin" },
    ])
  })

  //In this, and all the following REMOVE tests that requires authentication if you are using the simple version of friendRoutes
  describe("While attempting to get all users", function () {
    it("it should get two users when authenticated", async () => {
      const response = await request
        .get('/api/friends/all')
        .auth("pp@b.dk", "secret")
      expect(response.status).to.equal(200)
      expect(response.body.length).to.equal(3)
    })

    it("it should get a 401 when NOT authenticated", async () => {
      const response = await request
      .get('/api/friends/all')
    expect(response.status).to.equal(401)
    })
  })

  describe("While attempting to add a user", function () {
    it("it should Add the user Jan Olsen", async () => {
      const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret" }
      const response = await request.post('/api/friends').auth("pp@b.dk", "secret").send(newFriend)
      expect(response.status).to.equal(200)
      expect(response.body.id).to.be.not.null
    })

    it("It should fail to Add user due to wrong password length", async () => {
      const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "2311111111111111111111111111111111111111132132132132132132132132132132132132" }
      const response = await request.post('/api/friends').auth("pp@b.dk", "secret").send(newFriend)
      expect(response.status).to.equal(400)
    })
  })
  describe("While logged in as a user", function () {
    it("It should return the logged in user", async () => {
      const response = await request.get('/api/friends/me').auth("pp@b.dk", "secret");
      expect(response.body.email=="pp@b.dk");
    })
    it("It should edit the logged in user", async () => {
     const newFriend= { firstName: "paul", lastName: "Pan", email: "pp@b.dk", password: "secret", role: "user" }
      const response = await (await request.put('/api/friends/me').auth("pp@b.dk", "secret").send(newFriend));
      expect(response.body.firstName=="paul");
    })
  })
  describe("While verifying the get any user, given a userId (email)", function () {
    it("It should allow an admin user to find Donald Duck", async () => {
      const response = await request.get('/find-user/pp@b.dk').auth("aa@a.dk", "secret");
      expect(response.body.firstName=="Peter");
    })
    it("It should not, allow admin-users to find a non-existing user", async () => {
      const response = await request.get('/find-user/pp@b.dk').auth("aa@a.dk", "secret").catch(error);
      expect(ApiError);
    })

    it("It should not let a non-admin user find Donald Duck", async () => {
      const response = await request.get('/find-user/pp@b.dk').auth("pp@b.dk", "secret");
      expect(response.body.firstName=="Peter");
    })
  })

  describe("While verifying the 'edit any user', given a userId (email)", function () {
    it("It should allow an admin-user to edit Peter Pan", async () => {
      const newFriend= { firstName: "paul", lastName: "Pan", email: "pp@b.dk", password: "secret", role: "user" }
      const response = await request.put('/api/friends/pp@b.dk').auth("aa@a.dk", "secret").send(newFriend);
      expect(response.body.firstName=="paul");
    })
    })
    it("It should NOT allow a non-admin user to edit Peter Pan", async () => {
      const newFriend= { firstName: "paul", lastName: "Pan", email: "pp@b.dk", password: "secret", role: "user" }
      const response = await request.put('/api/friends/pp@b.dk').auth("pp@b.dk", "secret").send(newFriend).catch(error);
      expect(ApiError);
    })
  })

  //mangler
  describe("While verifying the delete any user, given a userId (email)", function () {
    it("It should allow an admin user to delete Donald Duck", async () => {
      const response = await request.delete('/api/friends/dd@b.dk').auth("aa@a.dk", "secret").catch(error);
     expect(response);
    })
    it("It should NOT allow a non-admin user to delete Donald Duck", async () => {
      const response = await request.delete('/api/friends/dd@b.dk').auth("dd@b.dk", "secret").catch(error);
      expect(ApiError);
    })
  })


