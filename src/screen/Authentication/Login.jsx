import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import {increment} from '../../redux/slice/counter'

const Login = () => {
    const navigation = useNavigation();
    const selector = useSelector((state)=>state.counter.value);
    const dispatch = useDispatch();
    return (
        <View>
        <Text>Login</Text>
        <TouchableOpacity onPress={()=>dispatch(increment())}>
            <Text>Add</Text>
        </TouchableOpacity>
        <Text>{selector}</Text>
        </View>
  )
}

export default Login