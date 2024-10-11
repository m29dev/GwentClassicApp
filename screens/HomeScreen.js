// screens/HomeScreen.js
import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AppContext } from '../appContext';

export default function HomeScreen({ navigation }) {

    const { appState, setAppState } = useContext(AppContext);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>

            <Text>Welcome {appState?.user?.email}</Text>

            <Button
                title="AUTH"
                onPress={() => navigation.navigate('Auth')}
            />
            <Button
                title="LOBBY"
                onPress={() => navigation.navigate('Lobby')}
            />
        </View>
    );
}