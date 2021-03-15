import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, View } from 'react-native';
import background from '../assets/images/background.jpg'
import { useRoute } from '@react-navigation/native';

import ChatMessage from '../components/ChatMessage';
import InputBox from '../components/InputBox';
import { API, graphqlOperation, SortDirection, Auth } from 'aws-amplify';
import { messagesByChatRoom } from '../src/graphql/queries'
import { onCreateMessage } from '../src/graphql/subscriptions'

const ChatRoomScreen = () => {

    const [messages, setMessages] = useState([])
    const [myId, setMyId] = useState(null);

    const route = useRoute();

    useEffect(() => {
        const fetchMessages = async () => {
            const messagesData = await API.graphql(
                graphqlOperation(
                    messagesByChatRoom, {
                        chatRoomID: route.params.id,
                        sortDirection: "DESC",
                    }
                )
            )
            setMessages(messagesData.data.messagesByChatRoom.items);
        }
        fetchMessages();
    }, [])

    useEffect(() => {
        const getMyId = async () => {
            const userInfo = await Auth.currentAuthenticatedUser()
            setMyId(userInfo.attributes.sub);

        }
        getMyId();
    }, [])

    useEffect(() => {
        const subscription = API.graphql(
            graphqlOperation(onCreateMessage)
                ).subscribe({
                next: (data) => {
                    const newMessage = data.value.data.onCreateMessage;
                        if (newMessage.chatRoomID !== route.params.id) {
                            return; 
                        }
                        //ADD message to the state
                        //put [messages] in the dependence array of UseEffect.
                        setMessages([newMessage, ...messages]);
                }
            });
        return() => subscription.unsubscribe();
    }, [messages])

    return (
        <ImageBackground style={{ width: '100%', height: '100%' }} source={background}>
        <FlatList
            data={messages}
                renderItem={({ item }) => <ChatMessage myId={myId} message={item} />}
            inverted
        />
            <InputBox chatRoomID={route.params.id}/>
        </ImageBackground>
    );
}

export default ChatRoomScreen; 