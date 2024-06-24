import { useCallback, useEffect, useState } from 'react'
import './GameFaction.css'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useOutletContext } from 'react-router-dom'
import { setMenuInfo } from '../../redux/authSlice'
import { useGameFactionsMutation } from '../../services/gameService'

const GameFactionComponent = () => {
    const { roomInfo, menuInfo } = useSelector((state) => state.auth)
    const [socket] = useOutletContext()
    const params = useParams()
    const dispatch = useDispatch()

    const handleAddToDeck = (item) => {
        const menuInfoEdit = structuredClone(menuInfo)

        // add card to the DECK
        menuInfoEdit.factions[menuInfo?.factionId].cardsDeck.push(item)

        // rem card from the COLLECTION
        const collection = []
        menuInfoEdit.factions[menuInfo?.factionId].cardsCollection.map(
            (card) => {
                if (card.id !== item.id) collection.push(card)
            }
        )
        menuInfoEdit.factions[menuInfo?.factionId].cardsCollection = collection

        dispatch(setMenuInfo(menuInfoEdit))
    }

    const handleAddToCollection = (item) => {
        const menuInfoEdit = structuredClone(menuInfo)

        // add card to the COLLECTION
        menuInfoEdit.factions[menuInfo?.factionId].cardsCollection.push(item)

        // rem card from the DECK
        const deck = []
        menuInfoEdit.factions[menuInfo?.factionId].cardsDeck.map((card) => {
            if (card.id !== item.id) deck.push(card)
        })
        menuInfoEdit.factions[menuInfo?.factionId].cardsDeck = deck

        dispatch(setMenuInfo(menuInfoEdit))
    }

    const handleChangePage = (dir) => {
        const menuInfoEdit = structuredClone(menuInfo)
        const currentFactionId = menuInfoEdit?.factionId
        const lastFactionId = menuInfoEdit?.factions?.length - 1

        if (dir === 'prev') {
            if (currentFactionId === 0) {
                menuInfoEdit.factionId = lastFactionId
            } else {
                menuInfoEdit.factionId = currentFactionId - 1
            }
        }

        if (dir === 'next') {
            if (currentFactionId === lastFactionId) {
                menuInfoEdit.factionId = 0
            } else {
                menuInfoEdit.factionId = currentFactionId + 1
            }
        }

        dispatch(setMenuInfo(menuInfoEdit))
    }

    const [displayLeaders, setDisplayLeaders] = useState(false)
    const handleChooseLeader = (leader) => {
        console.log('choose leader')

        const menuInfoEdit = structuredClone(menuInfo)
        menuInfoEdit.factions[menuInfo?.factionId].leaderDeck = leader

        dispatch(setMenuInfo(menuInfoEdit))

        setDisplayLeaders(false)
    }

    // SEND SOCKET WITH SELECTED DECK
    const id = params.id
    const handleGameInitFaction = async () => {
        console.log('socket gameInitFaction')

        socket.emit('gameInitFaction', {
            room_id: id,
            game_id: roomInfo?.roomGameId,
            faction: menuInfo?.factions?.[menuInfo?.factionId]?.faction,
            cardsDeck: menuInfo?.factions?.[menuInfo?.factionId]?.cardsDeck,
            leaderDeck: menuInfo?.factions?.[menuInfo?.factionId]?.leaderDeck,
        })

        console.log({
            room_id: id,
            game_id: roomInfo?.roomGameId,
            faction: menuInfo?.factions?.[menuInfo?.factionId]?.faction,
            cardsDeck: menuInfo?.factions?.[menuInfo?.factionId]?.cardsDeck,
            leaderDeck: menuInfo?.factions?.[menuInfo?.factionId]?.leaderDeck,
        })
    }

    // FETCH ON INIT FULL FACTION COLLECTION IF NOT FETCHED ALREADY
    const [getFactions] = useGameFactionsMutation()
    const handleFetchFactions = useCallback(async () => {
        try {
            const res = await getFactions().unwrap()
            console.log(res)

            dispatch(setMenuInfo(res))
        } catch (err) {
            console.log(err)
        }
    }, [getFactions, dispatch])

    useEffect(() => {
        if (!menuInfo) {
            handleFetchFactions()
        }
    }, [menuInfo, handleFetchFactions])

    // CALC CURRENT DECK NUMS
    const [cardDeckNum, setCardDeckNum] = useState(null)
    const [cardUnitNum, setCardUnitNum] = useState(null)
    const [cardSpecialNum, setCardSpecialNum] = useState(null)
    const [cardStrengthNum, setCardStrengthNum] = useState(null)
    const [cardHeroNum, setCardHeroNum] = useState(null)
    useEffect(() => {
        let unit = 0
        let special = 0
        let strength = 0
        let hero = 0

        menuInfo?.factions?.[menuInfo?.factionId]?.cardsDeck?.map((item) => {
            // unit
            if (item?.ability !== 'special' && item?.ability !== 'weather') {
                unit += 1
            }

            // special
            if (item?.ability === 'special') {
                special += 1
            }

            // strength
            if (item?.strength) {
                if (item?.ability === 'spy') {
                    strength -= +item?.strength
                } else {
                    strength += +item?.strength
                }
            }

            // hero
            if (item?.ability.includes('hero')) {
                hero += 1
            }
        })

        setCardDeckNum(
            menuInfo?.factions?.[menuInfo?.factionId]?.cardsDeck?.length
        )
        setCardUnitNum(unit)
        setCardSpecialNum(special)
        setCardStrengthNum(strength)
        setCardHeroNum(hero)
    }, [menuInfo])

    return (
        <div className="faction-box">
            <div className="navbar">
                <div className="navbar-left">
                    <div className="navbar-txt">Kolekcja Kart</div>
                </div>

                <div className="navbar-center">
                    <div
                        className="btn-prev"
                        onClick={() => handleChangePage('prev')}
                    >
                        {
                            menuInfo?.factions?.[
                                menuInfo?.factionId - 1 < 0
                                    ? menuInfo?.factions?.length - 1
                                    : menuInfo?.factionId - 1
                            ]?.faction
                        }
                    </div>

                    <div className="deck-center">
                        <div className="">
                            <h1>
                                {
                                    menuInfo?.factions?.[menuInfo?.factionId]
                                        ?.faction
                                }
                            </h1>
                        </div>
                    </div>

                    <img
                        src={`/icons/deck_shield_${
                            menuInfo?.factions?.[menuInfo?.factionId]?.faction
                        }.png`}
                    />

                    <div
                        className="btn-next"
                        onClick={() => handleChangePage('next')}
                    >
                        {
                            menuInfo?.factions?.[
                                menuInfo?.factionId + 1 >
                                menuInfo?.factions?.length - 1
                                    ? 0
                                    : menuInfo?.factionId + 1
                            ]?.faction
                        }
                    </div>
                </div>

                <div className="navbar-right">
                    <div className="navbar-txt">Karty w Talii</div>
                </div>
            </div>

            <div className="main-box">
                {/* COLLECTION CARDS */}
                <div className="left-box">
                    {menuInfo?.factions?.[
                        menuInfo?.factionId
                    ]?.cardsCollection?.map((item, index) => (
                        <div
                            key={index}
                            className="grid-item"
                            style={{
                                backgroundImage: `url("/lg/${item?.deck}_${item?.filename}.jpg")`,
                            }}
                            onClick={() => handleAddToDeck(item)}
                        ></div>
                    ))}
                </div>

                {/* LEADER CARD */}
                <div className="center-box">
                    <div
                        className="grid-item"
                        // style={{
                        //     backgroundImage: `url("/lg/${
                        //         menuInfo?.factions?.[menuInfo?.factionId]
                        //             ?.leadersCollection?.[0]?.deck
                        //     }_${
                        //         menuInfo?.factions?.[menuInfo?.factionId]
                        //             ?.leadersCollection?.[0]?.filename
                        //     }.jpg")`,
                        // }}

                        style={{
                            backgroundImage: `url("/lg/${
                                menuInfo?.factions?.[menuInfo?.factionId]
                                    ?.leaderDeck?.deck
                            }_${
                                menuInfo?.factions?.[menuInfo?.factionId]
                                    ?.leaderDeck?.filename
                            }.jpg")`,
                        }}
                        onClick={() => setDisplayLeaders(true)}
                    ></div>

                    <div className="faction-info">
                        <p>Wszystkie karty w talii</p>
                        <div className="faction-info-row">
                            <img src="/icons/deck_stats_count.png" />
                            <p>{cardDeckNum}</p>
                        </div>

                        <p>Liczba kart jednostek</p>
                        <div className="faction-info-row">
                            <img src="/icons/deck_stats_unit.png" />
                            <p>{cardUnitNum}</p>
                        </div>

                        <p>Karty specjalne</p>
                        <div className="faction-info-row">
                            <img src="/icons/deck_stats_special.png" />
                            <p>{cardSpecialNum}</p>
                        </div>

                        <p>Całkowita siła jednostek</p>
                        <div className="faction-info-row">
                            <img src="/icons/deck_stats_strength.png" />
                            <p>{cardStrengthNum}</p>
                        </div>

                        <p>Karty bohaterów</p>
                        <div className="faction-info-row">
                            <img src="/icons/deck_stats_hero.png" />
                            <p>{cardHeroNum}</p>
                        </div>
                    </div>

                    <div
                        className="btn-universal"
                        style={{ marginTop: '30px' }}
                        onClick={handleGameInitFaction}
                    >
                        READY
                    </div>
                </div>

                {/* ABSOLUTE LEADERS BLOCK */}
                {displayLeaders && (
                    <div className="center-box-absolute-leaders">
                        <div
                            className="absolute-leaders-hide"
                            onClick={() => setDisplayLeaders(false)}
                        >
                            X
                        </div>

                        {menuInfo?.factions?.[
                            menuInfo?.factionId
                        ]?.leadersCollection?.map((item, index) => (
                            <div
                                key={index}
                                className="grid-item"
                                style={{
                                    backgroundImage: `url("/lg/${item?.deck}_${item?.filename}.jpg")`,
                                }}
                                onClick={() => handleChooseLeader(item)}
                            ></div>
                        ))}
                    </div>
                )}

                {/* DECK CARDS */}
                <div className="right-box">
                    {menuInfo?.factions?.[menuInfo?.factionId]?.cardsDeck?.map(
                        (item, index) => (
                            <div
                                key={index}
                                className="grid-item"
                                style={{
                                    backgroundImage: `url("/lg/${item?.deck}_${item?.filename}.jpg")`,
                                }}
                                onClick={() => handleAddToCollection(item)}
                            ></div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default GameFactionComponent
