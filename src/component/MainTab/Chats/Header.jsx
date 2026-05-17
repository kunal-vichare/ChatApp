import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native'
import React, { useState } from 'react'
import { colors, fontSize, fontWeight, gap, padding } from '../../../constant'
import VectorIcons from '../../../utils/VectorIcons'
import { useNavigation } from '@react-navigation/native'
import { Divider, Menu } from 'react-native-paper'
import auth from '@react-native-firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import {toggleTheme} from '../../../redux/slice/darkMode'

const Header = () => {
    // const [darkMode, setDarkMode] = useState(false);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handleLogout = async () => {
        await auth().signOut();
    }
    const darkMode = useSelector((state)=>state.theme.dark);
    
    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>Chat Mate</Text>
            <View style={styles.btnContainer}>
                <VectorIcons
                    type="Entypo"
                    name="add-user"
                    size={fontSize.xl}
                    onPress={() => navigation.navigate("AppStack", {
                        screen: 'AllUserScreen'
                    })}
                />
                <VectorIcons
                    type="Feather"
                    name="camera"
                    size={fontSize.xl}
                />
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={
                        <VectorIcons
                            type="Entypo"
                            name="dots-three-vertical"
                            size={fontSize.xl}
                            onPress={() => setVisible(true)}
                        />
                    }
                >
                    <Menu.Item
                        onPress={() =>
                            console.log("Button pressed")
                        }
                        leadingIcon="account-outline"
                        title="Profile"
                    />
                    <Divider />
                    <View style={styles.switchContainer}>
                        <View style={styles.darkModeRow}>
                            <VectorIcons
                                type="MaterialCommunityIcons"
                                name="theme-light-dark"
                                size={22}
                            />
                            <Text style={styles.switchText}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={() => dispatch(toggleTheme())}
                        />
                    </View>
                    <Divider />
                    <Menu.Item
                        onPress={handleLogout}
                        leadingIcon="logout"
                        title="Logout"
                    />
                </Menu>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: padding.regular,
        paddingTop: 40,
        paddingHorizontal: padding.xs,
        alignItems: 'center'
    },
    mainText: {
        fontSize: fontSize.titleXs,
        color: colors.wp,
        fontWeight: fontWeight.max,
        paddingLeft: padding.base,
    },
    btnContainer: {
        flexDirection: 'row',
        gap: gap.lg
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    switchText: {
        fontSize: 16,
        color: colors.bp,
    },
    darkModeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
})

export default Header