/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useQuery, gql } from "@apollo/client"
import ILyndaFriend from "../interfaces/interfaces"

interface IFriends{
  allFriends:ILyndaFriend[];
}
const ALL_FRIENDS = gql`
 query {
  allFriends
  {
    id
    firstName
    lastName
    gender 
    email
    age
  }
 }
`

export default function All() {
  const {loading,error,data,refetch}= useQuery<IFriends>(
    ALL_FRIENDS,
    {fetchPolicy:"cache-and-network",pollInterval:50000}
    
    );
    if (loading) return <h1>Loading...</h1>
    if (error) return <h1>{error.toString()}</h1>
    
  return <div>
    <table className="table">
    <thead>
      <tbody>
        {data && data.allFriends.map(x=>{
         return <tr><td>{x.id}</td><td>{x.firstName}</td><td>{x.gender}</td><td>{x.lastName}</td></tr>
        })}
    
    </tbody>
    </thead>
    </table>
    <button onClick={()=>refetch()}>Refetch</button>
  </div>
}