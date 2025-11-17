import React from 'react'
import { getCurrentUser } from '../actions/getCurrentUser'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const { data } = await getCurrentUser()
  
  if(!data.user){
    redirect('/login')
  }

  console.log(data.user)
  return (
    <div></div>
  )
}
