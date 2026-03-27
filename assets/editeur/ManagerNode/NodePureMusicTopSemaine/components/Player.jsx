import React, {
    createRef,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'
import { createPortal } from 'react-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlay,
    faPause,
    faVolumeHigh,
    faXmark
} from '@fortawesome/free-solid-svg-icons'
import { PlayerContext } from './../PlayerProvider'
import { CSSTransition } from 'react-transition-group'

const isInIframe = () => {
    try {
        return window.self !== window.top
    } catch {
        return true // cross-origin safety
    }
}

const Player = ({ playerStyle = {}, iconStyle = {} }) => {
    const { player, audio, onClose } = useContext(PlayerContext)
    const ref = createRef()
    const progressRef = createRef()
    const volumeRef = createRef()
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [paused, setPaused] = useState(false)
    const [volume, setVolume] = useState(0)

    useEffect(() => {
        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('loadedmetadata', onLoadedMetadata)
        audio.addEventListener('pause', () => {
            setPaused(true)
        })
        audio.addEventListener('play', () => {
            setPaused(false)
        })

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate)
            audio.removeEventListener('loadedmetadata', onLoadedMetadata)
        }
    })

    const portalWindow = useMemo(() => {
        try {
            return isInIframe() ? window.parent : window
        } catch {
            return window
        }
    }, [])

    const portalTarget = portalWindow.document.body

    const onLoadedMetadata = useCallback(() => {
        setCurrentTime(audio.currentTime)
        setDuration(audio.duration)
        setVolume(audio.volume)
    }, [audio])

    const getCurrentTime = useCallback(() => {
        return new Date(currentTime * 1000).toISOString().substr(11, 8)
    }, [currentTime])

    const getDuration = useCallback(() => {
        return new Date(duration * 1000).toISOString().substr(11, 8)
    }, [duration])

    const getProgression = useCallback(() => {
        const _progression = Math.round((currentTime * 100) / duration)

        if (isNaN(_progression)) {
            return 0
        }
        return `${_progression}%`
    }, [currentTime, duration])

    const getVolume = useCallback(() => {
        return parseInt(volume * 100)
    }, [volume])

    const onDefineVolume = e => {
        e.preventDefault()
        e.stopPropagation()
        const _rect = volumeRef.current.getBoundingClientRect()
        const _volume = e.nativeEvent.offsetX / _rect.width
        setVolume(_volume)
        audio.volume = _volume
    }

    const onTimeUpdate = useCallback(() => {
        setCurrentTime(audio.currentTime)
    }, [audio])

    const onPlay = e => {
        e.preventDefault()
        e.stopPropagation()
        audio.play()
    }

    const onPause = e => {
        e.preventDefault()
        e.stopPropagation()
        audio.pause()
    }

    const onSeeking = e => {
        e.preventDefault()
        e.stopPropagation()

        const _rect = progressRef.current.getBoundingClientRect()

        const _tmp = {
            x: e.nativeEvent.offsetX,
            width: _rect.width,
            duration: audio.duration
        }
        const _currentTime = (_tmp.x * audio.duration) / _tmp.width
        audio.currentTime = _currentTime
    }

    return createPortal(
        <CSSTransition
            in={!!player}
            nodeRef={ref}
            timeout={300}
            classNames='alert'
            unmountOnExit
        >
            <div ref={ref} className='ce-puremusic-player'>
                <div className='inner' style={playerStyle}>
                        <div className='flex'>
                            <div
                                className='flex-none w-14 text-center flex items-center align-middle justify-center gap-2'
                                style={{ width: '3.5rem' }}
                            >
                                {paused === true ? (
                                    <FontAwesomeIcon
                                        icon={faPlay}
                                        className='icon icon-play'
                                        style={iconStyle}
                                        onClick={onPlay}
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faPause}
                                        className='icon icon-pause'
                                        style={iconStyle}
                                        onClick={onPause}
                                    />
                                )}
                            </div>
                            <div className='flex-1 text-center'>
                                <div className='font-montserrat text-base font-medium'>
                                    {player
                                        ? `${player.title} / ${player.artiste} - ${player.album}`
                                        : ''}
                                </div>
                                <div className='bar'>
                                    <div className='current-time'>
                                        {getCurrentTime()}
                                    </div>
                                    <div
                                        className='seek-barwrapper'
                                        onClick={onSeeking}
                                    >
                                        <div
                                            ref={progressRef}
                                            className='seek-bar'
                                        >
                                            <div
                                                className='play-bar'
                                                style={{
                                                    width: getProgression()
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='duration'>
                                        {getDuration()}
                                    </div>
                                </div>
                            </div>
                            <div className='flex-none w-48 text-center flex items-center align-middle justify-center'>
                                <FontAwesomeIcon
                                    icon={faVolumeHigh}
                                    className='icon'
                                    style={iconStyle}
                                />

                                <div
                                    ref={volumeRef}
                                    className='volume-barwrapper'
                                    onClick={onDefineVolume}
                                >
                                    <div className='volume-bar'>
                                        <div
                                            className='volume-status'
                                            style={{ width: `${getVolume()}%` }}
                                        />
                                    </div>
                                </div>

                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className='icon icon-close'
                                    style={iconStyle}
                                    onClick={e => onClose()}
                                />
                            </div>
                        </div>
                </div>
            </div>
        </CSSTransition>,
        portalTarget
    )
}
export default Player
