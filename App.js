// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, Image, TextInput, Button, Alert } from 'react-native';
// import { useState } from 'react';
// // 
// // 
// import { supabase } from './supabaseClient';
// // import { signInWithEmailAndPassword } from 'firebase/auth';
// // import { auth } from "./firebaseConfig";
// // import CardComponent from './components/card/cardCurrentPlayer/CardComponent';


// export default function App() {

//   const [email, setEmail] = useState()
//   const [password, setPassword] = useState()

//   const auth = async () => {
//     // auth test
//     try {
//       console.log("AUTH IN PROGRESS 1")
//       console.log(email, password)

//       // await createUserWithEmailAndPassword(auth1, email, password)
//       const res = await signInWithEmailAndPassword(email, password)

//       if (!res) return console.log('404')
//       console.log(res)
//       // Alert.alert('Auth Success: ', res.user)

//       console.log('AUTH SUCCESSFUL')
//     } catch (err) {
//       console.log(err)
//       // Alert.alert('catched 404')
//     }
//   }

//   return (
//     <View style={styles.container}>

//       <TextInput placeholder="email" value={email} onChangeText={setEmail} />
//       <TextInput placeholder='password' value={password} onChangeText={setPassword} />

//       <Button title='AUTH' onPress={auth}></Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// // App.js
// import React, { useState } from 'react';
// import { View, TextInput, Button, Text } from 'react-native';
// import { supabase } from './supabaseConfig';

// export default function App() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   // Sign Up
//   const handleSignUp = async () => {
//     const { error } = await supabase.auth.signUp({
//       email: email,
//       password: password,
//     });
//     setMessage(error ? error.message : 'Sign-up successful!');
//   };

//   // Sign In
//   const handleSignIn = async () => {
//     const user = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });

//     setMessage(user.error ? user.error.message : 'Signed in successfully!');
//     if (!user) return
//     console.log(user)
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={(text) => setEmail(text)}
//         style={{ marginBottom: 20, borderBottomWidth: 1 }}
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={(text) => setPassword(text)}
//         secureTextEntry
//         style={{ marginBottom: 20, borderBottomWidth: 1 }}
//       />
//       <Button title="Sign Up" onPress={handleSignUp} />
//       <Button title="Sign In" onPress={handleSignIn} />
//       {message ? <Text>{message}</Text> : null}
//     </View>
//   );
// }

// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'; // Your home screen component
import AuthScreen from './screens/AuthScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';
// import DetailsScreen from './screens/DetailsScreen'; // Another screen

import { AppProvider } from './appContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Lobby" component={LobbyScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
