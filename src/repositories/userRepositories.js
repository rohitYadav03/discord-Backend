import User from "../schema/user.js";
import crudRepository from "./crudRepository.js";

const userRepositories = {
    ...crudRepository(User),  // this willl give all the crud method 
     // create(), getAll(), getById(), update(), delete() — these

    getUserByName : async (name) => {

    const user = await User.findOne({username : name})
  return user;
},
getUserByEmail  : async (email) => {
    const user = await User.findOne({email});
    return user;
}
}

export default userRepositories;










