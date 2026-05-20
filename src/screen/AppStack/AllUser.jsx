import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUsers } from '../../database/firestoreCRUD';
import AllUserHeader from '../../component/AppStack/AllUserHeader'
import AllUserFlatlistData from '../../component/AppStack/AllUserFlatlistData'
import { colors, fontFamily, fontSize, fontWeight } from '../../constant';
import { useSelector } from 'react-redux';
import { Loader, Searchbar } from '../../component/MainTab/Chats'
import VectorIcon from '../../utils/VectorIcons';

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUserSearch, setAllUserSearch] = useState("");
  console.log("allUserSearch: ", allUserSearch);

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
      // console.log("myUID: ", myUid);

      const showData = data.filter(item => item.id !== myUid);
      setUsers(showData);
    }
  }

  const finalData = users?.filter(item => {
    //search filter
    const searchMatch = item?.name?.toLowerCase().includes(allUserSearch?.toLowerCase());
    return searchMatch;
  })
  return (
    <View>
      <AllUserHeader length={users.length} />
      <Searchbar
        value={allUserSearch}
        onSearch={setAllUserSearch}
        placeholder="Search for users"
      />
      {
        !allUserSearch &&
        <View>
          <TouchableOpacity style={styles.createBtn}>
            <VectorIcon
              type="MaterialIcons"
              size={24}
              name="group"
              color={colors.primary}
              style={styles.createIcon}
            />
            <Text style={styles.createText}>Create new group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createBtn}>
            <VectorIcon
              type="Ionicons"
              size={24}
              color={colors.primary}
              name="person-add"
              style={styles.createIcon}
            />
            <Text style={styles.createText}>Create new contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createBtn}>
            <VectorIcon
              type="MaterialIcons"
              size={24}
              color={colors.primary}
              name="groups"
              style={styles.createIcon}
            />
            <Text style={styles.createText}>Create new community</Text>
          </TouchableOpacity>
        </View>
      }
      {
        loading ?
          <Loader />
          :
          <View style={styles.container}>
            <Text style={styles.text}>Contacts on Chat Mate</Text>
            <FlatList
              data={finalData}
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
  },
  createBtn: {
    flexDirection: 'row',
    gap: 15,
    padding: 15,
    alignItems: 'center'
  },
  createText: {
    fontWeight: fontWeight.highlight,
    fontSize: fontSize.md
  },
  createIcon: {
    backgroundColor: colors.wp,
    padding: 10,
    borderRadius: 30,
  },
})

export default AllUser