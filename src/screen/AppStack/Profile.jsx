import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import VectorIcon from '../../utils/VectorIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { padding } from '../../constant';
import {formatWhatsAppLastSeen} from '../../utils/GetTime'

const Profile = () => {
    const actionButtons = [
        {
            title: 'Audio',
            icon: 'call',
            iconType: 'Ionicons',
        },
        {
            title: 'Video',
            icon: 'videocam',
            iconType: 'Ionicons',
        },
        {
            title: 'Pay',
            icon: 'wallet',
            iconType: 'Ionicons',
        },
        {
            title: 'Search',
            icon: 'search',
            iconType: 'Ionicons',
        },
    ];
    const navigation = useNavigation();
    const route = useRoute();
    const userData = route.params?.userData;  

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}>

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <VectorIcon
                        type="Ionicons"
                        name="arrow-back"
                        size={24}
                        onPress={() => navigation.goBack()}
                        style={{padding:10}}
                    />
                    <Image
                        source={{
                            uri: userData.profileImage
                        }}
                        style={styles.profileImage}
                    />
                    <VectorIcon
                        type="Entypo"
                        name="dots-three-vertical"
                        size={24}
                        onPress={() => navigation.goBack()}
                        style={{padding:10}}
                    />
                </View>
                    
                <View style={{alignItems:'center'}}>
                <Text style={styles.name}>{userData.name}</Text>
                <Text style={styles.email}>{userData.email}</Text>
                <Text style={styles.about}>{formatWhatsAppLastSeen(userData.lastSeen)}</Text>
                </View>
            </View>

            <View style={styles.actionContainer}>
                {actionButtons.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.actionButton}
                    >

                        <View style={styles.iconContainer}>
                            <VectorIcon
                                type={item.iconType}
                                name={item.icon}
                                size={24}
                                color="#25D366"
                            />
                        </View>

                        <Text style={styles.actionText}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.label}>About</Text>
                <Text style={styles.infoText}>
                    {userData.about}
                </Text>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.infoText}>
                    {userData.email}
                </Text>
            </View>
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
});