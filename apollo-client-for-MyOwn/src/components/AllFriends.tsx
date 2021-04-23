/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useQuery, gql } from "@apollo/client"
import ILyndaFriend from "../interfaces/interfaces"
interface IFriends{
  getAllFriends:ILyndaFriend[];
}
const ALL_FRIENDS = gql`
 query{
  getAllFriends{email,  firstName, lastName}
}
`

export default function All() {
  const {loading,error,data,refetch}= useQuery<IFriends>(
    ALL_FRIENDS,
    {fetchPolicy:"network-only",pollInterval:50000}
    
    );
    if (loading) return <h1>Loading...</h1>
    if (error) return <h1>{error.toString()}</h1>
    
  return <div>
    <table className="table">
    <thead>
      <tbody>
        {data && 
        data.getAllFriends.map(x=>{
         return <tr><td>{x.id}</td><td>{x.email}</td><td>{x.firstName}</td><td>{x.lastName}</td></tr>
        })

        }
    
    </tbody>
    </thead>
    </table>
    <button onClick={()=>refetch()}>Refetch</button>
  </div>
}