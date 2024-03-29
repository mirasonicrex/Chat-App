import { createIconSetFromFontello, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, TextInput, KeyboardAvoidingView} from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createMessage, updateChatRoom } from '../../src/graphql/mutations';

const InputBox = (props) => {

    const { chatRoomID } = props; 

    const [message, setMessage] = useState('');
    const [myUserId, setMyUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setMyUserId(userInfo.attributes.sub)
        }   
        fetchUser();
        }, [])
    
    const updateLastMessage = async (messageId: string) => {
        try {
            await API.graphql(
                graphqlOperation(
                    updateChatRoom, {
                    input: {
                        id: chatRoomID,
                        lastMessageID: messageId,
                    }
                }
                )
            );
        } catch(error) {
            console.log(error)
        }
    }
    
    const onPress = async () => {
        try {
            const newMessageData = await API.graphql(
                graphqlOperation(
                    createMessage, {
                        input: {
                            content: message,
                            userID: myUserId,
                            chatRoomID: chatRoomID,
                        }
                    }
                )
            )
            await updateLastMessage(newMessageData.data.createMessage.id)
        } catch (error) {
            console.log(error);
        }
        setMessage('');
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <TextInput
                    placeholder={"Type a message"}
                    style={styles.textMessage}
                    multiline
                    value={message}
                    onChangeText={setMessage}
                />
            </View>
            <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <MaterialIcons name="send" size={28} color="white"/>
            </View>
            </TouchableOpacity>
            </View>
    )
}

export default InputBox;