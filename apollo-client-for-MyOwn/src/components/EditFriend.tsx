  
import React, { useState } from "react";
import ILyndaFriend, {EditFriendInterface  } from "../interfaces/interfaces"
//do this
import ALL_FRIENDS from "./AllFriends"
import { useQuery, gql, useMutation } from "@apollo/client"

const EDIT_Friend = gql`
mutation editFriend($input:FriendEditInput){
  editFriend(input:$input){firstName}
}`

type AddFriendProps = {
  initialFriend?: EditFriendInterface
}

interface IKeyableFriend extends EditFriendInterface {
  [key: string]: any
}
const EditFriend = ({ initialFriend }: AddFriendProps) => {
  const EMPTY_FRIEND: EditFriendInterface = { firstName: "", lastName: "", email: ""}
  let newFriend = initialFriend ? initialFriend : { ...EMPTY_FRIEND }

  const [friend, setFriend] = useState({ ...newFriend })
  const [editFriend, { data }] = useMutation(EDIT_Friend,
    {});
  const handleChange = (event: any) => {
    const id = event.currentTarget.id;
    let friendToChange: IKeyableFriend = { ...friend }
   
      friendToChange[id] = event.currentTarget.value;
    console.log(friendToChange);
    setFriend({ ...friendToChange })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(JSON.stringify(friend))
    //Todo save friend on servers
    editFriend({ variables: { input: { ...friend } } }).catch(err=>console.log(err));

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
      <br/>
      <label>
        Email <br />
        <input type="text" id="email" value={friend.email} onChange={handleChange} />
      </label>
      <br />
     
      <br />
     
      <br />
      
      <br /><br />
      <input type="submit" value="Submit" />
    </form>
    <div>
      {data&&<p>{JSON.stringify(data.editFriend)+" was edited succesfully"
      
      }</p>}
    </div>
    </div>
  );
}

export default EditFriend;