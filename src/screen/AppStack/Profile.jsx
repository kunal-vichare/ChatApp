import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import VectorIcon from '../../utils/VectorIcons'

const Profile = () => {
    return (
        <View>
            <>
                <Image />
                <Text>Kunal</Text>
                <Text>+91 777602660</Text>
                <Text>Live and let live</Text>
            </>
            <View>
                <TouchableOpacity>
                    <VectorIcon
                        type="Ionicons"
                        name="videocam"
                        size={iconSize.xxl}
                        color={colors.primary}
                    />
                    <Text>Audio</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <VectorIcon
                        type="Ionicons"
                        name="videocam"
                        size={iconSize.xxl}
                        color={colors.primary}
                    />
                    <Text>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <VectorIcon
                        type="Ionicons"
                        name="videocam"
                        size={iconSize.xxl}
                        color={colors.primary}
                    />
                    <Text>Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <VectorIcon
                        type="Ionicons"
                        name="videocam"
                        size={iconSize.xxl}
                        color={colors.primary}
                    />
                    <Text>Search</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Profile