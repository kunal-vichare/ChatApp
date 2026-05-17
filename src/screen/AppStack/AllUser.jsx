import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUsers } from '../../database/firestoreCRUD';
import AllUserHeader from '../../component/AppStack/AllUserHeader'
import AllUserFlatlistData from '../../component/AppStack/AllUserFlatlistData'
import { colors, fontFamily, fontWeight } from '../../constant';
import { useSelector } from 'react-redux';
import { Loader } from '../../component/MainTab/Chats'

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const myUid = useSelector(state => state.auth.user.uid);

  useEffect(() => {
    try {
      setLoading(true);
      fetchUser();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    const data = await getUsers();
    if (data) {
      console.log("myUID: ", myUid);

      const showData = data.filter(item => item.id !== myUid);
      setUsers(showData);
    }
  }
  return (
    <View>
      <AllUserHeader />
      {
        loading ?
          <Loader />
          :
          <View style={styles.container}>
            <Text style={styles.text}>Contacts on Chat Mate</Text>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <AllUserFlatlistData item={item} />
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}> No users yet </Text>
                  <Text style={styles.emptyText}> Refer your frinds to use chatmate </Text>
                </View>
              }
            />
          </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: fontWeight.regular,
    color: colors.textGrey,
    marginVertical: 5,
  },
  container: {
    padding: 16
  },
  emptyContainer: {
    alignSelf: 'center',
    marginTop: '50%',
    gap: 3
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: fontFamily.popinsBold,
    fontWeight: fontWeight.bold,
    color: colors.textGrey
  }
})

export default AllUser