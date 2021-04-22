import React, { useState } from "react";
import ILyndaFriend, { Gender } from "../interfaces/interfaces"
//do this
import ALL_FRIENDS from "./AllFriends"
import { useQuery, gql, useMutation } from "@apollo/client"

const ADD_Friend = gql`
 mutation createFriend($friend:FriendInput) {
  createFriend(input:$friend){
    firstName
    lastName
    email
    age
    gender
    id
  }
}`

type AddFriendProps = {
  initialFriend?: ILyndaFriend
}

interface IKeyableFriend extends ILyndaFriend {
  [key: string]: any
}
const AddFriend = ({ initialFriend }: AddFriendProps) => {
  const EMPTY_FRIEND: ILyndaFriend = { firstName: "", lastName: "", gender: "OTHER", age: -1, email: "" }
  let newFriend = initialFriend ? initialFriend : { ...EMPTY_FRIEND }

  const [friend, setFriend] = useState({ ...newFriend })
  const [addFriend, { data }] = useMutation(ADD_Friend,
    {});
  const handleChange = (event: any) => {
    const id = event.currentTarget.id;
    let friendToChange: IKeyableFriend = { ...friend }
    if (id === "age") {
      friendToChange[id] = Number(event.currentTarget.value);
    } else {
      friendToChange[id] = event.currentTarget.value;
    }
    setFriend({ ...friendToChange })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(JSON.stringify(friend))
    //Todo save friend on servers
    addFriend({ variables: { friend: { ...friend } } });

    setFriend({ ...EMPTY_FRIEND })
  }


  return (
    <div>
    <form onSubmit={handleSubmit}>
      <label>
        FirstName<br />
        <input type="text" id="firstName" value={friend.firstName} onChange={handleChange} />
      </label>
      <br />
      <label>
        LastName <br />
        <input type="text" id="lastName" value={friend.lastName} onChange={handleChange} />
      </label>
      <br />
      <label>
        Gender &nbsp;
          <select id="gender" value={friend.gender} onChange={handleChange}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      <br />
      <label>
        Age <br />
        <input type="number" id="age" value={friend.age} onChange={handleChange} />
      </label>
      <br /><br />
      <input type="submit" value="Submit" />
    </form>
    <div>
      {data&&<p>{JSON.stringify(data.createFriend.firstName)+" was added succesfully"}</p>}
     
    </div>
    </div>
  );
}

export default AddFriend;