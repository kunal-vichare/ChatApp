import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUsers } from '../../database/firestoreCRUD';
import AllUserHeader from '../../component/AppStack/AllUserHeader'
import AllUserFlatlistData from '../../component/AppStack/AllUserFlatlistData'
import { colors, fontFamily, fontSize, fontWeight } from '../../constant';
import { useSelector } from 'react-redux';
import { Loader, Searchbar } from '../../component/MainTab/Chats'
import VectorIcon from '../../utils/VectorIcons';
import { Divider } from 'react-native-paper';
import { createGroupChat } from '../../database/firestoreCRUD'
import { useNavigation } from '@react-navigation/native';

const AllUser = () => {
  const navigation =useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUserSearch, setAllUserSearch] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

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

  const handleCreateGroup = async () => {
    if (selectedIds.length < 2) {
      Alert.alert('Select at least 2 members');
      return;
    }
    setShowNameInput(true);
  };

  const confirmCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Enter a group name');
      return;
    }
    const memberUids = users
      .filter(u => selectedIds.includes(u.name))
      .map(u => u.uid);

    const groupId = await createGroupChat(myUid, memberUids, groupName.trim());
    setIsSelectionMode(false);
    setSelectedIds([]);
    setGroupName('');
    setShowNameInput(false);
    navigation.navigate('AppStack', {
      screen: 'ChatScreen',
      params: { chatroomId: groupId, otherUserId: null },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <AllUserHeader length={users.length} isSelectionMode={isSelectionMode} setIsSelectionMode={setIsSelectionMode} setSelectedIds={setSelectedIds} />
      <Searchbar
        value={allUserSearch}
        onSearch={setAllUserSearch}
        placeholder="Search for users"
      />
      {
        (!isSelectionMode && !allUserSearch) ?
          <View>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => setIsSelectionMode(true)}
            >
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
          :
          null
      }
      {
        loading ?
          <Loader />
          :
          <View style={styles.container}>
            {selectedIds && selectedIds.length > 0 && (
              <View style={styles.selectedContainer}>
                <Text style={styles.to}>To:</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{selectedIds.length}</Text>
                </View>
                {selectedIds.map((item) => (
                  <View key={item} style={styles.innerContainer}>
                    <Text style={styles.selectedText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
            <Divider style={{ marginVertical: 10 }} />
            {isSelectionMode ?
              <Text style={styles.text}>Select the contact</Text>
              :
              <Text style={styles.text}>Contacts on Chat Mate</Text>
            }
            <FlatList
              data={finalData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <AllUserFlatlistData item={item} selectedIds={selectedIds} setSelectedIds={setSelectedIds} isSelectionMode={isSelectionMode} setIsSelectionMode={setIsSelectionMode} />
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}> No users yet </Text>
                  <Text style={styles.emptyText}> Refer your frinds to use chatmate </Text>
                </View>
              }
            />
            {isSelectionMode && (
              <>
                {showNameInput && (
                  <View style={{ padding: 12, gap: 8 }}>
                    <TextInput
                      placeholder="Group name"
                      value={groupName}
                      onChangeText={setGroupName}
                      style={{
                        borderWidth: 1, borderColor: '#ccc',
                        borderRadius: 8, padding: 10, fontSize: 16
                      }}
                    />
                    <TouchableOpacity
                      style={[styles.createGrpBtn, { maxWidth: '100%' }]}
                      onPress={confirmCreateGroup}
                    >
                      <Text style={styles.createGrpText}>Confirm & create</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {!showNameInput && (
                  <TouchableOpacity style={styles.createGrpBtn} onPress={handleCreateGroup}>
                    {/* <VectorIcon type="MaterialIcons" size={24} name="group" color={colors.primary} /> */}
                    <Text style={styles.createGrpText}>Create group</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
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
    flex: 1,
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
  selectedContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 10,
    gap: 10,
    flexDirection: 'row'
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'grey'
  },
  selectedText: {
    fontWeight: fontWeight.bold,
    color: colors.secondary,
    fontSize: fontSize.base,
    padding: 5
  },
  to: {
    fontWeight: fontWeight.exBold,
    fontSize: fontSize.md
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.wp,
    padding: 5,
    height: 26,
    width: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontWeight: fontWeight.exBold
  },
  createGrpBtn: {
    flexDirection: 'row',
    backgroundColor: colors.wp,
    padding: 15,
    gap: 10,
    borderRadius: 20,
    maxWidth: '40%',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center'
  },
  createGrpText: {
    fontWeight: fontWeight.bold,
    fontSize: fontSize.base,
    color: colors.primary
  }
})

export default AllUser