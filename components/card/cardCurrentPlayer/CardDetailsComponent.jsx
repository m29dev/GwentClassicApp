import { useSelector } from 'react-redux'

const CardDetailsComponent = () => {
    const { gameInfo } = useSelector((state) => state.auth)

    return (
        <div
            className="card-details"
            style={{
                backgroundImage: `url("/lg/${gameInfo?.gamePlayerCurrent?.player_card_selected?.deck}_${gameInfo?.gamePlayerCurrent?.player_card_selected?.filename}.jpg")`,
            }}
        ></div>
    )
}

export default CardDetailsComponent
