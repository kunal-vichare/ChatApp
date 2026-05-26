import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import VectorIcon from '../../utils/VectorIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatWhatsAppLastSeen } from '../../utils/GetTime';
import { subscribeToGroupInfo } from '../../database/realtimeCRUD';
import { colors, fontSize } from '../../constant';
import { useSelector } from 'react-redux';

const actionButtons = [
    { title: 'Audio',  icon: 'call',     iconType: 'Ionicons' },
    { title: 'Video',  icon: 'videocam', iconType: 'Ionicons' },
    { title: 'Pay',    icon: 'wallet',   iconType: 'Ionicons' },
    { title: 'Search', icon: 'search',   iconType: 'Ionicons' },
];

const Profile = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { isGroup, chatroomId, userData } = route.params;
    const myUid = useSelector(state => state.auth.user?.uid);

    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(isGroup);

    useEffect(() => {
        if (!isGroup || !chatroomId) return;
        subscribeToGroupInfo(chatroomId,setGroupData,setMembers,setLoading)
    }, [isGroup, chatroomId]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#25D366" />
            </View>
        );
    }

    // Render helpers
    const profileImage = isGroup
        ? groupData?.groupImage
        : userData?.profileImage;

    const displayName = isGroup
        ? groupData?.groupName
        : userData?.name;

    const subText = isGroup
        ? `Group: ${members.length} members`
        : userData?.email;

    const bottomText = isGroup
        ? groupData?.description
        : formatWhatsAppLastSeen(userData?.lastSeen);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <VectorIcon
                        type="Ionicons"
                        name="arrow-back"
                        size={24}
                        onPress={() => navigation.goBack()}
                        style={{ padding: 10 }}
                    />
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    <VectorIcon
                        type="Entypo"
                        name="dots-three-vertical"
                        size={24}
                        style={{ padding: 10 }}
                    />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.email}>{subText}</Text>
                    {bottomText && <Text style={styles.about}>{bottomText}</Text>}
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
                {actionButtons.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <VectorIcon type={item.iconType} name={item.icon} size={24} color="#25D366" />
                        </View>
                        <Text style={styles.actionText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/*Dynamic bottom list show */}
            {!isGroup ? (
                <>
                    <View style={styles.infoCard}>
                        <Text style={styles.label}>About</Text>
                        <Text style={styles.infoText}>{userData?.about}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.infoText}>{userData?.email}</Text>
                    </View>
                </>
            ) : (
                <View style={styles.infoCard}>
                    <Text style={styles.label}>{members.length} members</Text>
                    {members.map((member, index) => (
                        <View key={index} style={styles.memberRow}>
                            <Image
                                source={{ uri: member.profileImage }}
                                style={styles.memberImage}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.memberName}>{ myUid === member.uid ? "You" : member.name}</Text>
                                <Text style={styles.memberAbout}>{member.about || 'Available'}</Text>
                            </View>
                            {
                                member.uid===groupData.groupAdmin ?
                                <View style={styles.adminContainer}>
                                <Text style={styles.adminText}>Group Admin</Text>
                                </View>
                                :
                                null
                            }
                        </View>
                    ))}
                </View>
            )
        }
        </ScrollView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },

    header: {
        backgroundColor: '#fff',
        // alignItems: 'center',
        paddingVertical: 25,
        marginBottom: 12,
    },

    headerContent:{
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },

    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 16,
    },

    name: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111',
    },

    email: {
        fontSize: 16,
        color: '#666',
        marginTop: 6,
    },

    about: {
        fontSize: 15,
        color: '#888',
        marginTop: 6,
    },

    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#fff',
        paddingVertical: 18,
        marginBottom: 12,
    },

    actionButton: {
        alignItems: 'center',
    },

    iconContainer: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#E9F8EF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },

    actionText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },

    infoCard: {
        backgroundColor: '#fff',
        marginBottom: 12,
        padding: 18,
    },

    label: {
        fontSize: 13,
        color: '#25D366',
        marginBottom: 8,
        fontWeight: '600',
    },

    infoText: {
        fontSize: 16,
        color: '#111',
    },
    textContainer:{
        flex:1
    },
    memberRow:{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        paddingVertical: 10,
    },
    memberImage:{ 
        width: 46, 
        height: 46, 
        borderRadius: 23 
    },
    memberName:{ 
        fontSize: 15, 
        fontWeight: '600', 
        color: '#111' 
    },
    memberAbout:{ 
        fontSize: 13, 
        color: '#888', 
        marginTop: 2 
    },
    adminContainer:{
        backgroundColor:'#dbffa0',
        paddingHorizontal:5,
        paddingVertical:2,
        borderRadius:5
    },
    adminText:{
        fontSize:fontSize.sm,
        color:'#026002'
    }
});