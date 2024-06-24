import { useEffect, useState } from 'react'
import './card.css'

const CardPlayedComponent = (card) => {
    const [cardAbilites, setCardAbilites] = useState(null)
    useEffect(() => {
        const arr = card?.card?.ability?.split(' ')
        setCardAbilites(arr)
    }, [card])

    return (
        <div
            className="card"
            style={{
                backgroundImage: `url("/sm/${card?.card?.deck}_${card?.card?.filename}.jpg")`,
            }}
        >
            <div
                className="card-border"
                style={{
                    backgroundImage: `url("/icons/border_gold.png")`,
                }}
            ></div>

            {/* display strength normal icon if card has no ability */}
            {card?.card?.strength && card?.card?.ability !== 'hero' && (
                <div
                    className="card-power-box"
                    style={{
                        backgroundImage: `url("/icons/power_normal_icon.png")`,
                    }}
                >
                    {/* standard strengthEffect */}
                    {card?.card?.strengthEffect && (
                        <div
                            className={
                                +card?.card?.strengthEffect ===
                                +card?.card?.strength
                                    ? 'card-power'
                                    : +card?.card?.strengthEffect >
                                      +card?.card?.strength
                                    ? 'card-power card-power-effect'
                                    : 'card-power card-power-weather'
                            }
                        >
                            {card?.card?.strengthEffect}
                        </div>
                    )}

                    {/* standard strength */}
                    {/* {!card?.card?.strengthBond &&
                        !card?.card?.strengthWeather &&
                        !card?.card?.strengthMorale && (
                            <div className="card-power">
                                {card?.card?.strength}
                            </div>
                        )} */}

                    {/* weather strength */}
                    {/* {card?.card?.strengthWeather && (
                        <div className="card-power">
                            {card?.card?.strengthWeather}
                        </div>
                    )} */}

                    {/* bond strength */}
                    {/* {card?.card?.strengthBond &&
                        !card?.card?.strengthWeather && (
                            <div className="card-power bond-strength">
                                {card?.card?.strengthBond}
                            </div>
                        )} */}

                    {/* morale strength */}
                    {/* {card?.card?.strengthMorale &&
                        !card?.card?.strengthBond &&
                        !card?.card?.strengthWeather && (
                            <div className="card-power morale-strength">
                                {card?.card?.strengthMorale}
                            </div>
                        )} */}
                </div>
            )}

            {/* display strength hero icon if card has hero ability */}
            {card?.card?.strength && card?.card?.ability.includes('hero') && (
                <div
                    className="card-power-hero-box"
                    style={{
                        backgroundImage: `url("/icons/power_hero.png")`,
                    }}
                >
                    <div className="card-power-hero">
                        {card?.card?.strength}
                    </div>
                </div>
            )}

            {/* display row icon */}
            {card?.card?.row && (
                <div
                    className="card-row-box"
                    style={{
                        backgroundImage: `url("/icons/card_row_${card?.card?.row}.png")`,
                    }}
                ></div>
            )}

            {/* display ability icon if exists */}
            {cardAbilites?.map((item, index) => (
                <div
                    key={index}
                    className="card-ability-box"
                    style={{
                        backgroundImage: `url("/icons/card_ability_${item}.png")`,
                    }}
                ></div>
            ))}

            {/* display ability icon if exists */}
            {/* {card?.card?.ability && (
                <div
                    className="card-ability-box"
                    style={{
                        backgroundImage: `url("/icons/card_ability_${card?.card?.ability}.png")`,
                    }}
                ></div>
            )} */}

            {/* display spy if double ability */}
            {/* {card?.card?.ability === 'hero spy' && (
                <div
                    className="card-ability-box"
                    style={{
                        backgroundImage: `url("/icons/card_ability_spy.png")`,
                    }}
                ></div>
            )} */}
        </div>
    )
}

export default CardPlayedComponent
