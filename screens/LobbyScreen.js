import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { supabase } from '../supabaseConfig';
import { AppContext } from '../appContext';

// import fetchGames from '../models/GameModel'

export default function HomeScreen({ navigation }) {

    const [gameName, setGameName] = useState("")
    const { appState, setAppState } = useContext(AppContext);

    // // Listen to inserts
    // supabase
    //     .channel('games')
    //     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'games' }, handleInserts)
    //     .subscribe()

    const createGame = async () => {
        try {
            console.log('create a game')

            // const { data, error } = await supabase
            //     .from('games')
            //     .insert([
            //         { some_column: 'someValue', other_column: 'otherValue' },
            //     ])
            //     .select()

            const { data, error } = await supabase
                .from('games')
                .insert({ name: gameName, board: {}, player0: { id: appState?.user?.id, deck: [{ "item": "value" }] } })
                .select()

            if (data) console.log('CREATED GAME: ', data)
            navigation.navigate('Game', { gameId: data[0]?.id })

        } catch (err) {
            console.log(err)
        }
    }

    const joinGame = async (gameId) => {
        try {
            console.log('joining a game: ', gameId)
            navigation.navigate('Game', { gameId })
        } catch (err) {
            console.log(err)
        }
    }

    const [gamesData, setGamesData] = useState([])

    const fetchData = async () => {
        try {
            // // Simulating a fetch request (API call)
            // const response = await fetchGames();
            // const result = await response.json();

            // let { data: games, error } = await supabase
            //     .from('games')
            //     .select('*')

            const { data, error } = await supabase.from('games').select()


            if (error) {
                console.error('Error fetching users:', error);
            } else {
                console.log('Fetched DATA:', data);
            }

            setGamesData(data); // Update state with the fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Create a function to handle inserts
    const handleInserts = (payload) => {
        console.log('Change received!', payload)
        fetchData()
    }

    // Listen to inserts
    supabase
        .channel('games')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'games' }, handleInserts)
        .subscribe()

    useEffect(() => {
        console.log('redner lobby => fetching data')
        fetchData()

        // // Subscribe to real-time changes in the `posts` table
        // const subscription = supabase
        //     .from('games')
        //     .on('', (payload) => {
        //         console.log('Change received!', payload);
        //         fetchData(); // Fetch all data again on change
        //     })
        //     .subscribe();

        // // Cleanup on component unmount
        // return () => {
        //     supabase.removeSubscription(subscription);
        // };

    }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Lobby Screen</Text>
            <Button
                title="HOME"
                onPress={() => navigation.navigate('Home')}
            />
            <Button
                title="GAME"
                onPress={() => navigation.navigate('Game')}
            />

            <TextInput
                placeholder="game id"
                value={gameName}
                onChangeText={(text) => setGameName(text)}
                style={{ marginBottom: 20, borderBottomWidth: 1 }}
            />
            <Button
                title="create GAME"
                onPress={() => createGame()}
            />

            {/* <Button
                title="join GAME"
                onPress={() => joinGame()}
            /> */}

            {gamesData?.map((item, index) => (
                <Button title={item.name} key={index} onPress={() => joinGame(item?.id)} />
            ))}
        </View>
    );
}
