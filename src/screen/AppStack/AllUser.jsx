import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUsers } from '../../database/firestoreCRUD';
import AllUserFlatlistData from '../../component/AppStack/AllUserFlatlistData'

const AllUser = () => {
  const [users,setUsers]=useState([]);

  useEffect(()=>{
    fetchUser();
  },[]);

  const fetchUser=async()=>{
    const data = await getUsers();
    if (data) {
      setUsers(data);
    }
  }
  return (
    <View>
      
      <FlatList 
        data={users}
        keyExtractor={(item)=>item.id}
        renderItem={({ item }) => (
          <AllUserFlatlistData item={item} />
        )}
      />
    </View>
  )
}

export default AllUser