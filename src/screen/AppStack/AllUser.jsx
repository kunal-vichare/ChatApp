import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUsers } from '../../database/firestoreCRUD';
import AllUserHeader from '../../component/AppStack/AllUserHeader'
import AllUserFlatlistData from '../../component/AppStack/AllUserFlatlistData'
import { colors, fontWeight } from '../../constant';

const AllUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const data = await getUsers();
    if (data) {
      setUsers(data);
    }
  }
  return (
    <View >
      <AllUserHeader />
      <View style={styles.container}>
        <Text style={styles.text}>Contacts on Chat Mate</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AllUserFlatlistData item={item} />
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight:fontWeight.regular,
    color: colors.textGrey,
    marginVertical: 5,
  },
  container: {
    padding: 16
  }
})

export default AllUser