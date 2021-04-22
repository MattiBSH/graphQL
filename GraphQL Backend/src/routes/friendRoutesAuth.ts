import { Router } from "express"
const router = Router();
import { ApiError } from "../errors/errors"
import FriendFacade from "../facades/friendFacade"
const debug = require("debug")("friend-routes")

let facade: FriendFacade;

// Initialize facade using the database set on the application object
router.use(async (req, res, next) => {
  if (!facade) {
    const db = req.app.get("db")
    debug("Database used: " + req.app.get("db-type"))
    facade = new FriendFacade(db)
  }
  next()
})



// ALL ENDPOINTS BELOW REQUIRES AUTHENTICATION

import authMiddleware from "../middleware/basic-auth"
const USE_AUTHENTICATION = !process.env["SKIP_AUTHENTICATION"];

if (USE_AUTHENTICATION) {
  router.use(authMiddleware);
}


/**
 * authenticated users can edit himself
 */
router.put('/me', async function (req: any, res, next) {
  try {
    if (!USE_AUTHENTICATION) {
      throw new ApiError("This endpoint requires authentication", 500)
    }
      const email = req.credentials.userName;
      let newFriend = req.body;
     const s= await facade.editFriend(email,newFriend);
      res.json(s);
    } catch (err) {
      debug(err)
      if (err instanceof ApiError) {
        return next(err)
      }
     
    }
})

//An admin user can edit everyone 

router.put('/:email', async function (req: any, res, next) {

  try {
    if (USE_AUTHENTICATION && !req.credentials.role && req.credentials.role !== "admin") {
      throw new ApiError("Not Authorized", 401)
    }
    const email = req.params.email;

    let newFriend = req.body;

    const s= await facade.editFriend(email,newFriend);
    res.json(s);
  } catch (err) {
    debug(err)
    if (err instanceof ApiError) {
      return next(err)
    }
    next(new ApiError(err.message, 400));
  }
})

router.delete('/:email', async function (req: any, res, next) {

  try {
    if (USE_AUTHENTICATION && !req.credentials.role && req.credentials.role !== "admin") {
      throw new ApiError("Not Authorized", 401)
    }
    const email = req.params.email;
    const s= await facade.deleteFriend(email);
    res.json(s);
  } catch (err) {
    debug(err)
    if (err instanceof ApiError) {
      return next(err)
    }
    next(new ApiError(err.message, 400));
  }
})

//______________done Test all from here

//An admin user can fetch everyone
router.get("/find-user/:email", async (req: any, res, next) => {

  if (USE_AUTHENTICATION && !req.credentials.role && req.credentials.role !== "admin") {
    throw new ApiError("Not Authorized", 401)
  }
  const userId = req.params.email;
  try {
    const friend = await facade.getFrind(userId);
    if (friend == null) {
      throw new ApiError("user not found", 404)
    }
    const { firstName, lastName, email, role } = friend;
    const friendDTO = { firstName, lastName, email }
    res.json(friendDTO);
  } catch (err) {
    next(err)
  }
})

router.get("/all", async (req: any, res) => {
  if (USE_AUTHENTICATION && !req.credentials.role && req.credentials.role !== "admin") {
    throw new ApiError("Not Authorized", 401)
  }
  const friends = await facade.getAllFriends();

  const friendsDTO = friends.map(friend => {
    const { firstName, lastName, email } = friend
    return { firstName, lastName, email }
  })
  res.json(friendsDTO);
})
// This does NOT require authentication in order to let new users create themself
router.post('/', async function (req, res, next) {
  try {
    let newFriend = req.body;
    const status = await facade.addFriend(newFriend)
    res.json({ status })
  } catch (err) {
    debug(err)
    if (err instanceof ApiError) {
      next(err)
    } else {
      next(new ApiError(err.message, 400));
    }
  }
})
router.get("/me", async (req: any, res, next) => {
  if (!USE_AUTHENTICATION) {
    throw new ApiError("This endpoint requires authentication", 500)
  }
  const userId = req.credentials.userName;
  try {
    const friend = await facade.getFrind(userId);
    if (friend == null) {
      throw new ApiError("user not found", 404)
    }
    const { firstName, lastName, email, role } = friend;
    const friendDTO = { firstName, lastName, email }
    res.json(friendDTO);
  } catch (err) {
    next(err)
  }
})


export default router
