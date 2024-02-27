import { PlayIcon } from '@heroicons/react/20/solid';
import { createContext, useState, useEffect } from 'react'

const playContext = createContext({})

export default playContext;

export const PlayingProvider = ({children}) => {

    let [playing, SetPlaying] = useState(false);
    let [PlayingSong, SetPlayingSong] = useState(null);
    let [audio, setAudio] = useState(null);

    
    let UpdatePlayingSong = async (song) => {
        SetPlaying(true);
        SetPlayingSong(song)
        console.log(PlayingSong)
        if (audio){
            audio.pause();
            audio.currentTime = 0;
        }
        audio = new Audio(require("../audio/" + song.file.split('/')[song.file.split('/').length - 1]))
        setAudio(audio)
        audio.play()
        console.log(PlayingSong)
    }

    let playPause = async () =>{
        SetPlaying(!playing);
        console.log("audio:",audio)
        playing && audio ? audio.pause() : audio.play();
        console.log(audio.currentTime)
    }

    let data = {
        playing : playing, 
        playingSong : PlayingSong,
        updatePlayingSong : UpdatePlayingSong,
        playPause : playPause,
        audio : audio
    }

    return (
        <playContext.Provider value={data}>
            {children}
        </playContext.Provider>
    )

}