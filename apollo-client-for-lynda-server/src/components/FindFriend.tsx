/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client"
import ILyndaFriend from "../interfaces/interfaces"

const GET_FRIEND = gql`
 query getFriend($id: ID) {
    getFriend(id:$id){
     id
     email
     age
     firstName
     lastName
     gender
   }
}
`
interface IfriendResult{
  getFriend: ILyndaFriend
}
interface IVariableInput{
  id:String
}
export default function FindFriend() {
  const [id, setId] = useState("")
  const [getFriend,{loading,called,data}] = useLazyQuery<IfriendResult,IVariableInput>(
    GET_FRIEND,
    {fetchPolicy:"cache-and-network"}
  );
   
  const fetchFriend = () => {
    
    alert(`Find friend with id: ${id}`)
    getFriend({variables:{id}})
  }

  return (
    <div>
      ID:<input type="txt" value={id} onChange={e => {
        setId(e.target.value)
      }} />
      &nbsp; <button onClick={fetchFriend}>Find Friend</button>
      <br />
      <br />

      
      {called&&loading&&<p>Loading...</p>}
      {data&&<p>{data.getFriend.firstName}</p>}

    </div>)
}
