import React from 'react'
import { View, ActivityIndicator } from 'react-native'

const Loading = ({ loading }) => {
    return (
        <View>
            {
                !loading ?
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#00000045',
                        zIndex: 10,
                        flex: 1
                    }}>
                        <ActivityIndicator color='red' size='large' />
                    </View> : null
            }
        </View>
    )
}
export default Loading
