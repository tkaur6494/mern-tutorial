const User = require("../models/User");
const Notes = require("../models/Notes");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, resp) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return resp.status(400).json({ message: "No users found" });
  }
  resp.json(users);
});

// @desc Create new user
// @route Post /users
// @access Private
const createNewUser = asyncHandler(async (req, resp) => {
  const { username, password, roles } = req.body;
  //validate input
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return resp.status(400).json({ message: "All fields are required" });
  }
  //check duplicates
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return resp.status(409).json({ message: "Duplicate username" });
  }

  //hash password for inserting in database
  const hashPassword = await bcrypt.hash(password, 10); //salt rounds

  const userObject = { username, password: hashPassword, roles };
  //create and save new user to database
  const user = await User.create(userObject);

  if (user) {
    resp.status(201).json({ message: `New user ${username} created` });
  } else {
    resp.status(400).json({ message: "Invalid user data received." });
  }
});

// @desc Update a user
// @route Patch /users
// @access Private
const updateUser = asyncHandler(async (req, resp) => {
  const { id, username, roles, active, password } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof(active) != "boolean"
  ) {
    return resp.status(400).json({ message: "All fields are required." });
  }

  const user = await User.findById(id).exec()

  if(!user){
    return resp.status(400).json({ message: "User not found" });
  }

  //check for duplicate
  const duplicate = await User.findOne({username}).lean().exec()
  
  //allow updates to the original user
  if(duplicate && duplicate?._id.toString() != id){
    return resp.status(409).json({message:"Duplicate username"})
  }

  user.username = username
  user.roles = roles
  user.active = active

  if(password){
    user.password = await brcypt.hash(password, 10)
  }
  const updatedUser = await user.save()

  resp.json({message: `${updatedUser.username} updated`})
});

// @desc Delete a user
// @route Delete /users
// @access Private
const deleteUser = asyncHandler(async (req, resp) => {
    const {id} = req.body
    if(!id){
        return resp.status(400).json({message:"User id required."})
    }

    const notes = await Notes.findOne({user: id}).lean().exec()
    if(notes){
        return resp.status(400).json({message:"User has assigned notes."})
    }

    const user = await User.findById(id).exec()
    if(!user){
        return resp.status(400).json({message:"User not found."})
    }

    const result = await user.deleteOne()
    const reply = `Username ${user.username} with id ${user._id} deleted.`

    resp.json(reply)
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
