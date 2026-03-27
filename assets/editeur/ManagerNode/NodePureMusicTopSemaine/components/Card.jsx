import React from 'react'
import AudioRow from './AudioRow'

export default function (props) {
    const {
        musique,
        position,
        itemStyle,
        numberStyle,
        titleStyle,
        descriptionStyle,
        iconStyle
    } = props

    return (
        <div className="ce-puremusic-top-semaine-item" style={itemStyle}>
            <AudioRow
                title={musique.titre}
                artiste={musique?.artiste ?? ''}
                album={musique?.album ?? ''}
                src={musique.source}
                number={position}
                numberStyle={numberStyle}
                titleStyle={titleStyle}
                descriptionStyle={descriptionStyle}
                iconStyle={iconStyle}
            />
        </div>
    )
}
