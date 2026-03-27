import React, { useContext } from 'react'
import { PlayerContext } from '../PlayerProvider'
import { PlayIcon } from 'lucide-react'

const AudioRow = ({ title, artiste, album, src, number, numberStyle, titleStyle, descriptionStyle, iconStyle }) => {
    const { onPlay } = useContext(PlayerContext)

    return (
        <article>
            <div className='ce-puremusic-top-semaine-row'>
                <div className='ce-puremusic-top-semaine-number' style={numberStyle}>
                    {number}
                </div>
                <div className='ce-puremusic-top-semaine-row-content'>
                    <p className='ce-puremusic-top-semaine-row-content-title' style={titleStyle}>
                        <strong>{title}</strong>
                    </p>
                    <p className='ce-puremusic-top-semaine-row-content-description' style={descriptionStyle}>
                        {artiste} - {album}
                    </p>
                </div>
                <div
                    className='ce-puremusic-top-semaine-icon-wrap'
                    style={iconStyle}
                    onClick={() => onPlay(src, title, artiste, album)}
                >
                    <PlayIcon />
                </div>
            </div>
        </article>
    )
}

export default AudioRow
