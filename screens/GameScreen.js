import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { supabase } from '../supabaseConfig';
import { AppContext } from '../appContext';
import CardComponent from '../components/card/cardCurrentPlayer/CardComponent';
import deckRealms from '../assets/deck/deckRealms';
import deckMonsters from '../assets/deck/deckMonsters';
import deckNilfgaard from '../assets/deck/deckNilfgaard';
import deckScoiatael from '../assets/deck/deckScoiatael';

export default function HomeScreen({ navigation, route }) {
    const { gameId } = route?.params
    const [gameData, setGameData] = useState({})
    const { appState, setAppState } = useContext(AppContext);

    const joinGame = async () => {
        try {
            console.log('joining a game...')

            const { error } = await supabase
                .from('games')
                .update({
                    player1: {
                        "id": appState.user.id,
                        "deck": [
                            {
                                "item": "value"
                            }
                        ]
                    }
                })
                .eq('id', gameId)

            if (error) return console.log(error)

            fetchData()
        } catch (err) {
            console.log(err)
        }
    }

    const fetchData = async () => {
        try {
            const { data, error } = await supabase.from('games').select().eq('id', gameId).single()

            if (error) {
                console.error('Error fetching users:', error);
            } else {
                console.log('Fetched DATA:', data);
            }

            // if (!data?.player0) return console.log('User creator')
            // if (!data?.player1) return console.log('User joiner')
            // if (data?.player1 & data?.player0) { return console.log('Game is full'), navigation.navigate('Lobby') }

            setGameData(data); // Update state with the fetched data

            // check for userId in gameData
            if (!data.player0) return navigation.navigate('Lobby')
            if (data.player0.id === appState.user.id) return console.log('Welcome game owner')

            if (!data.player1) return joinGame()
            if (data.player1.id === appState.user.id) return console.log('Welcome game joiner')

            return navigation.navigate('Lobby')
            // if (data?.player0?.id !== appState.user.id & data?.player1?.id === appState.user.id) return navigation.navigate('Lobby')
            // setGameData(data); // Update state with the fetched data
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
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}`, }, handleInserts)
        .subscribe()

    useEffect(() => {
        fetchData()

        console.log(deckRealms)
    }, [])

    const renderItem = ({ item }) => (
        <View style={styles.gridItem}>
            <CardComponent card={item} />
        </View>
    );

    const decks = [
        "Realms",
        "Monsters",
        "Nilfgaard",
        "Scoiatael"
    ];

    const [count, setCount] = useState(0);

    // Function to increase the count
    const increaseCount = () => {
        if (count === 3) return setCount(0)
        setCount(count + 1);
    };

    // Function to decrease the count
    const decreaseCount = () => {
        if (count === 0) return setCount(3)
        setCount(count - 1);
    };

    const [currentDeckName, setCurrentDeckName] = useState("")
    const [currentDeckData, setCurrentDeckData] = useState([])

    useEffect(() => {
        const cur = decks[count]

        setCurrentDeckName(cur)

        if (count === 0) return setCurrentDeckData(deckRealms)
        if (count === 1) return setCurrentDeckData(deckMonsters)
        if (count === 2) return setCurrentDeckData(deckNilfgaard)
        if (count === 3) return setCurrentDeckData(deckScoiatael)

    }, [count])

    return (
        <View style={{ flex: 1 }}>
            <Text>Game Screen</Text>
            <Button
                title="HOME"
                onPress={() => navigation.navigate('Home')}
            />
            <Text>{gameId}</Text>

            {/* {deckRealms.map((item, index) => (
                <CardComponent key={index} card={item} />
            ))} */}

            <Button title='<' onPress={decreaseCount} />
            <Text>{currentDeckName}</Text>
            <Button title='>' onPress={increaseCount} />

            <FlatList
                // data={count === 0 ? deckRealms : count === 1 ? deckMonsters : count === 2 ? deckNilfgaard : count === 3 ? deckScoiatael : null}
                data={currentDeckData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2} // 2 items in a row
                columnWrapperStyle={styles.row} // Style the row to add spacing
                contentContainerStyle={{ paddingBottom: 20 }}  // Add space at the bottom to allow scrolling
            />

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
    gridItem: {
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#f8f8f8',
        borderRadius: 8,
        overflow: 'hidden',
        // padding: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});