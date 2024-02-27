import React, { useState, useEffect } from 'react';
import playContext from '../context/PlayingContext.js';

export function CustomPlayer(props) {
    let { playing, playingSong, playPause, audio } = React.useContext(playContext)
    let [currentTime, setCurrentTime] = useState(0)
    let [audioLength, setAudioLength] = useState(0.01)



    function playPauseFunc() {
        playPause();
    }

    function getTimeDisplay(seconds) {
        return `${parseInt(seconds / 60)}.${seconds % 60 < 10 ? "0" : ""}${parseInt(seconds % 60)}`
    }

    function handleChange(event){
        console.log("Changed slider",event.target.value)
        setCurrentTime(audioLength * event.target.value / 100)
        audio.currentTime = audioLength * event.target.value / 100
    }

    useEffect(() => {
        setCurrentTime(0)
        const interval = setInterval(() => {
            setCurrentTime(audio.currentTime)
            setAudioLength(audio ? audio.duration : null)
        }, 1000);

        return () => clearInterval(interval);
    }, [audio])

    return (
        <div className='flex w-full bg-neutral-900 border-2 border-gray-500'>
            <div class="grid items-center  grid-cols-10 w-full px-4 py-2">
                <div class="col-span-2  h-fit justify-center w-fit">
                    <div className="flex ">
                        <div onClick={playPauseFunc} className='px-2 cursor-pointer'>
                            {playing ?
                                <svg class="w-6 h-6 text-slate-200 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 16">
                                    <path d="M3 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm7 0H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z" />
                                </svg>
                                :
                                <svg class="w-6 h-6 text-slate-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 16">
                                    <path d="M0 .984v14.032a1 1 0 0 0 1.506.845l12.006-7.016a.974.974 0 0 0 0-1.69L1.506.139A1 1 0 0 0 0 .984Z" />
                                </svg>
                            }
                        </div>

                        <div>
                            <h1 className='text-lg mx-2 text-slate-200'>
                                {getTimeDisplay(currentTime)} : {audio ? getTimeDisplay(audioLength) : null}
                            </h1>
                        </div>

                    </div>
                </div>

                <div class="col-span-4 h-fit px-2">
                    <input id="default-range" value = {currentTime * 100/audioLength} onChange={handleChange} type="range" class="w-full h-2 bg-neutral-800 accent-red-600 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>

                <div class="col-span-4 h-fit right-0">
                    <div className='flex items-center justify-end gap-x-4'>
                        <h1 className="text-lg truncate text-slate-200">{playingSong ? playingSong.title : null}</h1>
                        <h1 className="text-lg truncate text-slate-200">{playingSong ? playingSong.user_obj.username : null}</h1>
                        <img className='h-16 w-16 self-center object-cover object-center my-2'
                            src={props.song ? require("../images/music-pics/" + playingSong.image.split('/')[playingSong.image.split('/').length - 1]) : null}>
                        </img>
                    </div>
                    <div className="flex w-full justify-end">
                        <h1 className="text-sm truncate text-slate-200 right-0">{playingSong ? playingSong.bpm : null}</h1>
                    </div>
                </div>
            </div>
        </div>

    );
};