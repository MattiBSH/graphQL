/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useLazyQuery, gql,useMutation } from "@apollo/client"
import ILyndaFriend from "../interfaces/interfaces"
const DEL = gql`
mutation deleteFriend($input:String){

    deleteFriend(input:$input)

}
`
interface IfriendResult{
  getFriend: ILyndaFriend
}
interface IVariableInput{
  id:String
}
export default function DeleteFriend() {
  const [id, setID] = useState("")
 const [delFriend, { data }] = useMutation(DEL);
   
  const delFriendMethod = () => {
    
    alert(`Delete Friend with email: ${id}`)
    delFriend({variables:{id}})
  }

  return (
    <div>
      ID:<input type="txt" value={id} onChange={e => {
        setID(e.target.value)
      }} />
      &nbsp; <button onClick={delFriendMethod}>Delete Friend</button>
      <br />
      <br />

      
     
        {data && <p>{JSON.stringify(data)}</p>}
    </div>)
}