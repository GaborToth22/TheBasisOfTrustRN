import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import eye from '../constants/eye.png'
import eyeh from '../constants/eye-hide.png'

const FormField = ({ title, value,placholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View style={ otherStyles }>
      <Text style={[tw`text-base font-medium`, { color: 'white'}]}>{title}</Text>
      <View style={[tw`border-2 w-full h-16 px-4 rounded-2xl items-center flex-row`, { borderColor: 'silver', backgroundColor: 'black', color: 'white'}]}>
        <TextInput 
            style={[tw`flex-1 font-medium text-base`, { color: 'white'}]}
            value={value}
            placeholder={placholder}
            placeholderTextColor='#7b7b8b'
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image source={showPassword ? eye : eyeh}
                    style={tw`w-6 h-6`}
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField