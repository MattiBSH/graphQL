/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client"
import ILyndaFriend from "../interfaces/interfaces"


const GET_FRIEND = gql`
query getFriend($email:String){

  getFriend(input:$email),
  {
    firstName
    lastName
  }

}
`
interface IfriendResult{
  getFriend: ILyndaFriend
}
interface IVariableInput{
  email:String
}
export default function FindFriend() {
  const [email, setEmail] = useState("")
  const [getFriend,{loading,called,data}] = useLazyQuery<IfriendResult,IVariableInput>(
    GET_FRIEND,
    {fetchPolicy:"cache-and-network"}
  );
   
  const fetchFriend = () => {
    
    alert(`Find friend with email: ${email}`)
    getFriend({variables:{email}})
  }

  return (
    <div>
      Email:<input type="txt" value={email} onChange={e => {
        setEmail(e.target.value)
      }} />
      &nbsp; <button onClick={fetchFriend}>Find Friend</button>
      <br />
      <br />

      
      {called&&loading&&<p>Loading...</p>}
      {data&&<p>{data.getFriend.firstName} {data.getFriend.lastName}</p>}

    </div>)
}
