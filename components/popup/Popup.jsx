import './Popup.css'
import { useSelector } from 'react-redux'

const Popup = () => {
    const { gameInfo, userInfo } = useSelector((state) => state.auth)

    return (
        <>
            {gameInfo?.gameTurn === userInfo?.nickname && (
                <div className="player-turn">YOUR ROUND</div>
            )}

            {gameInfo?.gameTurn !== userInfo?.nickname && (
                <div className="player-turn">OPPONENT ROUND</div>
            )}
        </>
    )
}

export default Popup
