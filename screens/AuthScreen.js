// App.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { supabase } from '../supabaseConfig';
import { AppContext } from '../appContext';

export default function App({ navigation }) {

    const { appState, setAppState } = useContext(AppContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Sign Up
    const handleSignUp = async () => {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        setMessage(error ? error.message : 'Sign-up successful!');
    };

    // Sign In
    const handleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        setMessage(error ? error.message : 'Signed in successfully!');
        if (!data) return
        console.log(data)
        setAppState({ user: { id: data?.user?.id, email: data?.user?.email, accessToken: data?.session?.access_token } });

        navigation.navigate('Home')
    }


    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{ marginBottom: 20, borderBottomWidth: 1 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                style={{ marginBottom: 20, borderBottomWidth: 1 }}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Sign In" onPress={handleSignIn} />
            {message ? <Text>{message}</Text> : null}
        </View>
    );
}