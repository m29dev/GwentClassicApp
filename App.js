import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
// import { Image } from 'expo-image';


import CardComponent from './components/card/cardCurrentPlayer/CardComponent';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Cool App</Text>
      <CardComponent card={{
        name: 'Geralt of Rivia',
        id: '138',
        deck: 'neutral',
        row: 'close',
        strength: '15',
        ability: 'hero muster muster_fetcher',
        fetchMusterId: [1380],
        filename: 'geralt',
        count: '1',
      }}></CardComponent>
      {/* <Image source={require('./assets/sm/neutral_ciri.jpg')}></Image> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
