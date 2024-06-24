import CardComponent from '../card/cardCurrentPlayer/CardComponent'
import CardDetailsComponent from '../card/cardCurrentPlayer/CardDetailsComponent'
import { useSelector, useDispatch } from 'react-redux'
import CardPlayedComponent from '../card/cardCurrentPlayer/CardPlayedComponent'
import '../../pages/PrivatePages/PrivatePages.css'
// import { setGameInfo } from '../../redux/authSlice'

import { useOutletContext } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import Popup from '../popup/Popup'
import { useGameReadIdMutation } from '../../services/gameService'
import { setGameInfo } from '../../redux/authSlice'
import CardPlayedCurrentComponent from '../card/cardCurrentPlayer/CardPlayedCurrentComponent'

const GameComponent = () => {
    const { userInfo, gameInfo, roomInfo } = useSelector((state) => state.auth)
    const [socket] = useOutletContext()
    const dispatch = useDispatch()

    // const dispatch = useDispatch()

    // config
    const handlePlayCard = (_row) => {
        const cardSelected = structuredClone(
            gameInfo?.gamePlayerCurrent?.player_card_selected
        )

        // check if it's current player turn
        if (gameInfo?.gameTurn !== userInfo?.nickname) {
            return console.log('cannot play now')
        }

        if (
            cardSelected?.row !== 'agile' &&
            !cardSelected?.row !== 'leader' &&
            !_row?.includes(cardSelected?.row)
        ) {
            // check if cardSelected's row is equal to clicked row
            return console.log('select right row, seleced row: ', _row)
        }

        // check if cardSelected's row is agile and row is not siege
        if (cardSelected?.row === 'agile' && _row === 'siege') {
            return console.log('select right row')
        }

        if (cardSelected?.ability.includes('medic')) {
            console.log('CARD IS A MEDIC')

            if (
                gameInfo?.gamePlayerCurrent?.player_cards_to_retrieve?.length >
                0
            ) {
                setDisplayCardsToRetrieve(true)
                return
            }
        }

        if (cardSelected?.ability === 'spy') {
            console.log('CARD IS A SPY')
        }

        if (cardSelected?.row === 'special') {
            cardSelected.row = `${_row}`
        }

        // if card is agile
        let isAgile = false
        if (cardSelected?.row === 'agile') {
            isAgile = true
        }

        // if all good send socket event
        socket.emit('gameCardPlay', {
            room_id: roomInfo?._id,
            game_id: roomInfo?.roomGameId,
            cardSelected,
            agile: isAgile,
            agileRow: _row,
        })
    }

    const [displayCardsToRetrieve, setDisplayCardsToRetrieve] = useState(false)
    const handleSetCardToRetrieve = (card) => {
        const cardSelected = structuredClone(
            gameInfo?.gamePlayerCurrent?.player_card_selected
        )

        cardSelected.cardToRetrieve = card

        // if all good send socket event
        socket.emit('gameCardPlay', {
            room_id: roomInfo?._id,
            game_id: roomInfo?.roomGameId,
            cardSelected,
            agile: false,
            agileRow: null,
        })

        setDisplayCardsToRetrieve(false)

        console.log('card selected to be retrieved: ', card)
    }

    const handlePassRound = () => {
        socket.emit('gamePassRound', {
            room_id: roomInfo?._id,
            game_id: roomInfo?.roomGameId,
        })
    }

    const [getGameId] = useGameReadIdMutation()
    const handleFetchGameInfoData = useCallback(async () => {
        const res = await getGameId({
            game_id: roomInfo?.roomGameId,
            userId: userInfo?.nickname,
        }).unwrap()

        dispatch(setGameInfo(res))

        console.log('FETCHING GAME DATA ON INIT...', res)
    }, [getGameId, roomInfo, userInfo, dispatch])

    const [displayUseLeaderAbility, setDisplayUseLeaderAbility] =
        useState(false)

    useEffect(() => {
        if (
            gameInfo?.gamePlayerCurrent?.player_card_selected?.row?.includes(
                'leader'
            ) &&
            !gameInfo?.gamePlayerCurrent?.player_card_selected?.cardUsed
        ) {
            console.log(
                'LEADER CARD SELECTED: ',
                gameInfo?.player_card_selected
            )
            setDisplayUseLeaderAbility(true)
        }
    }, [gameInfo])

    // on init fetch gameInfo data from database
    useEffect(() => {
        handleFetchGameInfoData()
    }, [handleFetchGameInfoData])

    return (
        <div className="game-page-container">
            {/* LEFTSIDE */}
            <div className="left-side">
                <div className="general-player0">
                    {gameInfo?.gamePlayerOpponent?.player_name !==
                        userInfo?.nickname && (
                        <CardComponent
                            card={gameInfo?.gamePlayerOpponent?.player_leader}
                        ></CardComponent>
                    )}
                </div>

                {/* PLAYER OPP INFO */}
                <div
                    className={
                        gameInfo?.gameTurn !== userInfo?.nickname
                            ? 'player0-info-box player-turn-active'
                            : 'player0-info-box'
                    }
                >
                    {/* player avatar */}
                    <div className="leftside"></div>

                    {/* player nickname, player faction */}
                    <div className="rightside-top">
                        <h2 style={{ margin: '0px' }}>
                            {gameInfo?.gamePlayerOpponent?.player_name}
                        </h2>
                        <h5 style={{ margin: '0px' }}>
                            {gameInfo?.gamePlayerOpponent?.player_deck}
                        </h5>
                    </div>

                    {/* player card info */}
                    <div className="rightside-bottom">
                        <div className="rb-cards-count-box"></div>
                        <div>
                            {
                                gameInfo?.gamePlayerOpponent
                                    ?.player_cards_current?.length
                            }
                        </div>
                        <div className="gs-box">
                            <div className="p0-g0"></div>
                            <div className="p0-g1"></div>
                        </div>
                    </div>

                    {/* player game score */}
                    <div className="player0-score-box">
                        {gameInfo?.gamePlayerOpponent?.player_points}
                    </div>
                </div>

                {/* WEATHER BOX */}
                <div
                    // className="weather-box"

                    className={
                        gameInfo?.gamePlayerCurrent?.player_card_selected
                            ?.row === 'weather'
                            ? 'weather-box row-common-active'
                            : 'weather-box'
                    }
                    onClick={() => handlePlayCard('weather')}
                >
                    {gameInfo?.gamePlayerBoth?.weather_row_cards?.map(
                        (item, index) => (
                            <CardPlayedComponent
                                key={index}
                                card={item}
                            ></CardPlayedComponent>
                        )
                    )}
                </div>

                {/* PLAYER CURR INFO */}
                <div
                    className={
                        gameInfo?.gameTurn === userInfo?.nickname
                            ? 'player1-info-box player-turn-active'
                            : 'player1-info-box'
                    }
                >
                    {/* player avatar */}
                    <div className="leftside"></div>

                    {/* player nickname, player faction */}
                    <div className="rightside-top">
                        <h2 style={{ margin: '0px' }}>
                            {gameInfo?.gamePlayerCurrent?.player_name}
                        </h2>
                        <h5 style={{ margin: '0px' }}>
                            {gameInfo?.gamePlayerCurrent?.player_deck}
                        </h5>
                    </div>

                    {/* player card info */}
                    <div className="rightside-bottom">
                        <div className="rb-cards-count-box"></div>
                        <div>
                            {
                                gameInfo?.gamePlayerCurrent
                                    ?.player_cards_current?.length
                            }
                        </div>
                        <div className="gs-box">
                            <div className="p1-g0"></div>
                            <div className="p1-g1"></div>
                        </div>
                    </div>

                    {/* player game score */}
                    <div className="player1-score-box">
                        {gameInfo?.gamePlayerCurrent?.player_points}
                    </div>
                </div>
                <div className="general-player1">
                    {gameInfo?.gamePlayerCurrent?.player_name ===
                        userInfo?.nickname && (
                        <CardComponent
                            card={gameInfo?.gamePlayerCurrent?.player_leader}
                        ></CardComponent>
                    )}
                </div>

                {/* PASS BUTTON */}
                <div className="pass-btn">
                    <button
                        onClick={handlePassRound}
                        disabled={
                            gameInfo?.gameTurn === userInfo?.nickname
                                ? false
                                : true
                        }
                    >
                        PASS
                    </button>
                </div>
            </div>

            {/* CENTER */}
            <div className="center-side">
                {/* ROW BOX OPP */}
                <div className="row-box-player0">
                    {/* ROW SIEGE */}
                    <div className="row row-opp-siege">
                        <div className="row-points">
                            {
                                gameInfo?.gamePlayerOpponent
                                    ?.player_cards_board?.[2]?.board_row_points
                            }
                        </div>
                        <div className="row-special-card-box">
                            {gameInfo?.gamePlayerOpponent
                                ?.player_cards_board?.[2]
                                ?.board_row_card_special && (
                                <CardPlayedComponent
                                    card={
                                        gameInfo?.gamePlayerOpponent
                                            ?.player_cards_board?.[2]
                                            ?.board_row_card_special
                                    }
                                ></CardPlayedComponent>
                            )}
                        </div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'siege' &&
                                (gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.ability === 'spy' ||
                                    gameInfo?.gamePlayerCurrent
                                        ?.player_card_selected?.ability ===
                                        'hero spy')
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('siege')}
                        >
                            {gameInfo?.gamePlayerOpponent?.player_name !==
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerOpponent?.player_cards_board?.[2]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}
                        </div>
                    </div>

                    {/* ROW RANGED */}
                    <div className="row row-opp-ranged">
                        <div className="row-points">
                            {
                                gameInfo?.gamePlayerOpponent
                                    ?.player_cards_board?.[1]?.board_row_points
                            }
                        </div>
                        <div className="row-special-card-box">
                            {gameInfo?.gamePlayerOpponent
                                ?.player_cards_board?.[1]
                                ?.board_row_card_special && (
                                <CardPlayedComponent
                                    card={
                                        gameInfo?.gamePlayerOpponent
                                            ?.player_cards_board?.[1]
                                            ?.board_row_card_special
                                    }
                                ></CardPlayedComponent>
                            )}
                        </div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'ranged' &&
                                (gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.ability === 'spy' ||
                                    gameInfo?.gamePlayerCurrent
                                        ?.player_card_selected?.ability ===
                                        'hero spy')
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('ranged')}
                        >
                            {gameInfo?.gamePlayerOpponent?.player_name !==
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerOpponent?.player_cards_board?.[1]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}
                        </div>
                    </div>

                    {/* ROW CLOSE */}
                    <div className="row row-opp-close">
                        <div className="row-points">
                            {
                                gameInfo?.gamePlayerOpponent
                                    ?.player_cards_board?.[0]?.board_row_points
                            }
                        </div>
                        <div className="row-special-card-box">
                            {gameInfo?.gamePlayerOpponent
                                ?.player_cards_board?.[0]
                                ?.board_row_card_special && (
                                <CardPlayedComponent
                                    card={
                                        gameInfo?.gamePlayerOpponent
                                            ?.player_cards_board?.[0]
                                            ?.board_row_card_special
                                    }
                                ></CardPlayedComponent>
                            )}
                        </div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'close' &&
                                (gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.ability === 'spy' ||
                                    gameInfo?.gamePlayerCurrent
                                        ?.player_card_selected?.ability ===
                                        'hero spy')
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('close')}
                        >
                            {gameInfo?.gamePlayerOpponent?.player_name !==
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerOpponent?.player_cards_board?.[0]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}
                        </div>
                    </div>
                </div>

                {/* ROW BOX CURRENT PLAYER */}
                <div className="row-box-player1">
                    {/* ROW CLOSE */}
                    <div className="row row-cur-close">
                        <div className="row-points">
                            {
                                gameInfo?.gamePlayerCurrent
                                    ?.player_cards_board?.[0]?.board_row_points
                            }
                        </div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'special'
                                    ? 'row-special-card-box row-common-active'
                                    : 'row-special-card-box'
                            }
                            onClick={() => handlePlayCard('close special')}
                        >
                            {gameInfo?.gamePlayerCurrent
                                ?.player_cards_board?.[0]
                                ?.board_row_card_special && (
                                <CardPlayedComponent
                                    card={
                                        gameInfo?.gamePlayerCurrent
                                            ?.player_cards_board?.[0]
                                            ?.board_row_card_special
                                    }
                                ></CardPlayedComponent>
                            )}
                        </div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row ===
                                    ('close' || 'agile') &&
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.ability !== 'spy' &&
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.ability !==
                                    'hero spy'
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('close')}
                        >
                            {gameInfo?.gamePlayerCurrent?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerCurrent?.player_cards_board?.[0]?.board_row_cards?.map(
                                    (item, index) => (
                                        // <CardPlayedComponent
                                        //     key={index}
                                        //     card={item}
                                        // ></CardPlayedComponent>

                                        <CardPlayedCurrentComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedCurrentComponent>
                                    )
                                )}
                        </div>
                    </div>

                    {/* ROW RANGE */}
                    <div className="row row-cur-ranged">
                        <div className="row-points">
                            {
                                gameInfo?.gamePlayerCurrent
                                    ?.player_cards_board?.[1]?.board_row_points
                            }
                        </div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'special'
                                    ? 'row-special-card-box row-common-active'
                                    : 'row-special-card-box'
                            }
                            onClick={() => handlePlayCard('ranged special')}
                        >
                            {gameInfo?.gamePlayerCurrent
                                ?.player_cards_board?.[1]
                                ?.board_row_card_special && (
                                <CardPlayedComponent
                                    card={
                                        gameInfo?.gamePlayerCurrent
                                            ?.player_cards_board?.[1]
                                            ?.board_row_card_special
                                    }
                                ></CardPlayedComponent>
                            )}
                        </div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row ===
                                    ('ranged' || 'agile') &&
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.ability !== 'spy' &&
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.ability !==
                                    'hero spy'
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('ranged')}
                        >
                            {gameInfo?.gamePlayerCurrent?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerCurrent?.player_cards_board?.[1]?.board_row_cards?.map(
                                    (item, index) => (
                                        // <CardPlayedComponent
                                        //     key={index}
                                        //     card={item}
                                        // ></CardPlayedComponent>

                                        <CardPlayedCurrentComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedCurrentComponent>
                                    )
                                )}
                        </div>
                    </div>

                    {/* ROW SIEGE */}
                    <div className="row row-cur-siege">
                        <div className="row-points">
                            {
                                gameInfo?.gamePlayerCurrent
                                    ?.player_cards_board?.[2]?.board_row_points
                            }
                        </div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'special'
                                    ? 'row-special-card-box row-common-active'
                                    : 'row-special-card-box'
                            }
                            onClick={() => handlePlayCard('siege special')}
                        >
                            {gameInfo?.gamePlayerCurrent
                                ?.player_cards_board?.[2]
                                ?.board_row_card_special && (
                                <CardPlayedComponent
                                    card={
                                        gameInfo?.gamePlayerCurrent
                                            ?.player_cards_board?.[2]
                                            ?.board_row_card_special
                                    }
                                ></CardPlayedComponent>
                            )}
                        </div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'siege' &&
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.ability !== 'spy' &&
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.ability !==
                                    'hero spy'
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('siege')}
                        >
                            {gameInfo?.gamePlayerCurrent?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerCurrent?.player_cards_board?.[2]?.board_row_cards?.map(
                                    (item, index) => (
                                        // <CardPlayedComponent
                                        //     key={index}
                                        //     card={item}
                                        // ></CardPlayedComponent>

                                        <CardPlayedCurrentComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedCurrentComponent>
                                    )
                                )}
                        </div>
                    </div>
                </div>

                {/* CURRENT CARDS ROW */}
                <div className="row-box-cards">
                    <div
                        className="row-cards"
                        style={
                            gameInfo?.length >= 10
                                ? { justifyContent: 'flex-start' }
                                : {}
                        }
                    >
                        {gameInfo?.gamePlayerCurrent?.player_name ===
                            userInfo?.nickname &&
                            gameInfo?.gamePlayerCurrent?.player_cards_current?.map(
                                (item, index) => (
                                    <CardComponent
                                        key={index}
                                        card={item}
                                    ></CardComponent>
                                )
                            )}
                    </div>
                </div>
            </div>

            {/* RIGHTSIDE */}
            <div className="right-side">
                {/* DISPLAY CARD DETAILS ON CARD CLICK */}
                <CardDetailsComponent></CardDetailsComponent>

                {/* LEADER CARD POPUP */}
                {displayUseLeaderAbility && (
                    <div className="leader-ability-absolute center-box-absolute-leaders">
                        Do You want to use leaders ability?
                        <button
                            onClick={() => {
                                setDisplayUseLeaderAbility(false)
                                handlePlayCard('leader')
                            }}
                        >
                            YES
                        </button>
                        <button
                            onClick={() => setDisplayUseLeaderAbility(false)}
                        >
                            NO
                        </button>
                    </div>
                )}
            </div>

            {/* ABSOLUTE POSITIONED INFO (PLAYER TURN, GAME UPDATES) */}
            <Popup></Popup>

            {/* ABSOLUTE BLOCK CARDS TO RETRIEVE BY MEDIC CARD */}
            {displayCardsToRetrieve && (
                <div className="center-box-absolute-leaders">
                    <div
                        className="absolute-leaders-hide"
                        onClick={() => setDisplayCardsToRetrieve(false)}
                    >
                        X
                    </div>

                    {gameInfo?.gamePlayerCurrent?.player_cards_to_retrieve?.map(
                        (item, index) => (
                            <div
                                key={index}
                                className="grid-item"
                                style={{
                                    backgroundImage: `url("/lg/${item?.deck}_${item?.filename}.jpg")`,
                                }}
                                onClick={() => handleSetCardToRetrieve(item)}
                            ></div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default GameComponent
