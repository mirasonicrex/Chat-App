import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { ChatRoom } from '../../types';
import styles from './style';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
 
export type ChatListItemProps = {
    chatRoom: ChatRoom;
}

const ChatListItem = (props: ChatListItemProps) => {
    const { chatRoom } = props;
    const [otherUser, setOtherUser] = useState(null);
    const navigation = useNavigation();


   // const user = chatRoom.chatRoomUsers.items[0].user;
    //filter put users that are not ourself

    useEffect(() => {
    const getOtherUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      if (chatRoom.chatRoomUsers.items[0].user.id === userInfo.attributes.sub) {
        setOtherUser(chatRoom.chatRoomUsers.items[1].user);
      } else {
        setOtherUser(chatRoom.chatRoomUsers.items[0].user);
      }
    }
    getOtherUser();
  }, [])
    
    const onClick = () => {
        navigation.navigate('ChatRoom', {
            id: chatRoom.id,
            name: otherUser.name,
        })
    }

    if (!otherUser) {
        return null;
    }

    return (
        <TouchableWithoutFeedback onPress={onClick}>
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Image source={{ uri: otherUser.imageUri }} style={styles.avatar} />
     
                <View style={styles.midContainer}> 
                    <Text style={styles.userName}>{otherUser.name}</Text>
                    <Text style={styles.lastMsg}>{chatRoom.lastMessage ? `${chatRoom.lastMessage.content}`: ""}</Text>
                </View>
            </View>
            <Text style={styles.time}>
                {chatRoom.lastMessage && moment(chatRoom.lastMessage.createdAt).format('YYYY/MM/DD')} 
            </Text>
            </View>
        </TouchableWithoutFeedback>
    )
};

export default ChatListItem;