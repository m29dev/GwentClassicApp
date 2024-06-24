// import './card.css'
// import { useDispatch, useSelector } from 'react-redux'
// import { setGameInfo } from '../../../redux/authSlice'
import { useEffect, useState } from 'react'
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native'

const CardComponent = (card) => {
    // const { gameInfo } = useSelector((state) => state.auth)

    // const dispatch = useDispatch()

    // const handlePlayCard = () => {
    //     const gameInfoEdit = structuredClone(gameInfo)
    //     gameInfoEdit.gamePlayerCurrent.player_card_selected = card?.card

    //     dispatch(setGameInfo(gameInfoEdit))
    // }

    const [imageUri, setImageUri] = useState('')
    const [img, setImg] = useState([{ ciri: '../../../assets/sm/neutral_ciri.jpg' }])

    const [cardAbilites, setCardAbilites] = useState(null)
    useEffect(() => {
        const arr = card?.card?.ability?.split(' ')
        setCardAbilites(arr)
        // console.log(card)

        console.log(`require(../../../assets/sm/${card?.card?.deck}_${card?.card?.filename}.jpg)`)


        setImageUri(`../../../assets/sm/${card?.card?.deck}_${card?.card?.filename}.jpg`)
        console.log(imageUri)

        console.log("URI: ", img[0].ciri)
    }, [card, img])

    return (
        <View>
            <ImageBackground
                style={styles.sCard}
            // style={{
            //     backgroundImage: `url("/sm/${card?.card?.deck}_${card?.card?.filename}.jpg")`,
            // }}
            // onClick={handlePlayCard}
            // source={require("../../../assets/sm/" + card?.card?.deck)}
            // source={require('../../../assets/sm/neutral_ciri.jpg')}
            // source={require(img[0].ciri)}

            >
                <Image
                    style={styles.sCardBorder}

                    source={require('../../../assets/icons/border_gold.png')}
                ></Image>

                {/* display strength normal icon if card has no ability */}
                {
                    card?.card?.strength && !card?.card?.ability.includes('hero') && (
                        <ImageBackground
                            className="card-power-box"

                            // style={{
                            //     backgroundImage: `url("/icons/power_normal_icon.png")`,
                            // }}

                            source={require('../../../assets/icons/power_normal_icon.png')}
                        >
                            <Text className="card-power">{card?.card?.strength}</Text>
                        </ImageBackground>
                    )
                }

                {/* display strength hero icon if card has hero ability */}
                {
                    card?.card?.strength && card?.card?.ability.includes('hero') && (
                        <ImageBackground
                            // className="card-power-hero-box"

                            style={styles.sCardPowerHeroBox}

                            source={require('../../../assets/icons/power_hero.png')}

                        >
                            <Text className="card-power-hero">
                                {card?.card?.strength}
                            </Text>
                        </ImageBackground>
                    )
                }

                {/* display row icon */}
                {
                    card?.card?.row && (
                        <ImageBackground
                            className="card-row-box"
                            style={{
                                backgroundImage: `url("/icons/card_row_${card?.card?.row}.png")`,
                            }}
                        ></ImageBackground>
                    )
                }

                {/* display ability icon if exists */}
                {
                    cardAbilites?.map((item, index) => (
                        <View
                            key={index}
                            className="card-ability-box"
                            style={{
                                backgroundImage: `url("/icons/card_ability_${item}.png")`,
                            }}
                        ></View>
                    ))
                }
            </ImageBackground>
        </View >

    )
}

export default CardComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    sCard: {
        width: 130,
        height: 190,
        minWidth: 130,
        minHeight: 190,
        marginLeft: 2,
        marginRight: 2,
        /* width: 100%,
        height: 100%, */
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        position: 'relative',
    },

    sCardBorder: {
        width: 130,
        height: 190,
        minWidth: 130,
        minHeight: 190,
        // position: 'static',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center'

        // backgroundPosition: 'center',
        // backgroundSize: '100 % 100 %',
        // backgroundRepeat: 'no - repeat',

        // -webkit - box - shadow: 0px 0px 94px - 23px rgba(242, 255, 0, 0.5),
        // -moz - box - shadow: 0px 0px 94px - 23px rgba(241, 255, 0, 0.5),
        // box - shadow: 0px 0px 94px - 23px rgba(241, 255, 0, 0.5),

        // position: 'absolute',
        // zIndex: 1,

        // opacity: 0,
    },

    //     card: hover.card - border {
    //     opacity: 100,
    // }

    sCardPowerBox: {
        width: 30,
        height: 30,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',

        position: 'absolute',
        zIndex: 100,
    },
    sCardPower: {
        textAlign: 'center',
        color: 'black',
    },
    /* .bond-strength {
        color: green,
    } */
    /* .morale-strength {
        color: rgb(118, 221, 0),
    } */

    sCardPowerEffect: {
        color: 'green',
    },
    sCardPowerWeather: {
        // color: rgb(255, 86, 35),
    },

    sCardPowerHeroBox: {
        width: 60,
        height: 60,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        /* display: flex,
        justify-content: 'center',
        align-items: 'center',
        align-content: 'center', */

        position: 'absolute',
        top: -4,
        left: -4,
        zIndex: 100,
    },

    sCardPowerHero: {
        width: 37,
        height: 37,
        border: '1px green solid',
        textAlign: 'center',
        // color: rgb(255, 255, 255),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        /* position: absolute,
        top: 12,
        left: 13, */
    },

    cardRowBox: {
        width: 30,
        height: 30,
        /* margin-top: calc(100% - 35px),
        margin-left: calc(100% - 30px), */
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',

        position: 'absolute',
        top: 85,
        left: 60,
        zIndex: 100,
    },

    sCardAbilityBox: {
        width: 30,
        height: 30,
        /* margin-top: calc(100% - 35px),
        margin-left: calc(100% - 30px), */
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',

        position: 'absolute',
        top: 85,
        left: 27,
        zIndex: 100,
    }

})
