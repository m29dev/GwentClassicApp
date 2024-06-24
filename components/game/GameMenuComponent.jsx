import './GameMenu.css'

const GameMenuComponent = () => {
    return (
        <div className="menu-box">
            {/* current player menu info */}
            <div className="left-box">
                <div
                    className="icon"
                    style={{
                        backgroundImage: `url("/icons/icon_player_border.png")`,
                    }}
                ></div>
            </div>

            {/* opponent player menu info */}
            <div className="right-box"></div>
        </div>
    )
}

export default GameMenuComponent
