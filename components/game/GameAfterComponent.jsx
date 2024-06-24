import { useSelector } from 'react-redux'

const GameAfterComponent = () => {
    const { userInfo, gameInfo } = useSelector((state) => state.auth)

    return (
        <div>
            <h1>{userInfo?.nickname === gameInfo?.gameWinner}</h1>

            <h2>
                {gameInfo?.gamePlayerCurrent?.player_name}{' '}
                {gameInfo?.gamePlayerCurrent?.player_points} :{' '}
                {gameInfo?.gamePlayerOpponent?.player_points}{' '}
                {gameInfo?.gamePlayerOpponent?.player_name}
            </h2>
        </div>
    )
}

export default GameAfterComponent
