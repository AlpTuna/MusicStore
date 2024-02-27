import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomPlayer } from '../player/customPlayer.js';


import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, ReceiptPercentIcon, XMarkIcon as XMarkIconMini } from '@heroicons/react/20/solid'
import {
    MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBBreadcrumb, MDBBreadcrumbItem, MDBProgress,
    MDBProgressBar, MDBIcon, MDBListGroup, MDBListGroupItem
} from 'mdb-react-ui-kit';
import playContext from '../context/PlayingContext.js';

export default function ProfilePage() {

    let { username } = useParams();
    let { user } = React.useContext(AuthContext)
    let data, userID;
    const [sameUser, setSame] = useState(false);
    let [songs, setSongs] = useState([])
    let [allSongs, setAllSongs] = useState([])
    const [follows, setFollows] = useState(null);
    let [profile, setProfile] = useState(null);
    let [filterOptions, setFilterOptions] = useState({ "genre": [], "mood": [], "tags": [], "bpm": [] })
    let [selectedFilters, setSelectedFilters] = useState({ "genre": [], "mood": [], "tags": [], "bpm": [] })
    let [showModal, setShowModal] = useState(false)
    let [openFilter, setOpenFilter] = useState(null)
    let {playing, playingSong, updatePlayingSong, playPause} = React.useContext(playContext)
    console.log("context contains:",playingSong, playing)
    
    const [searchParams] = useSearchParams();


    React.useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/user/?username=${username}`)
            .then(res => res.json())
            .then(data => {
                setProfile(data[0])
                console.log(user.user_id, data[0].id)
                setSame(user.user_id == data[0].id)

                fetch(`http://127.0.0.1:8000/api/get_followers/${data[0].id}`)
                    .then(res => res.json())
                    .then(data2 => {
                        let followers = []
                        for (let i = 0; i < data2.length; i++) {
                            followers.push(data2[i].id)
                        }
                        console.log("followers: ", followers)
                        setFollows(user.user_id != data[0].id && followers.includes(user.user_id) ? true : false)
                    })

                fetch(`http://127.0.0.1:8000/api/user_tracks/${data[0].id}`)
                    .then(res => res.json())
                    .then(data => {
                        setSongs(data)
                        setAllSongs(data)
                        filterOptions["genre"] = [...new Set(data.map((item) => item.genre))].sort();
                        filterOptions["mood"] = [...new Set(data.map((item) => item.mood))].sort();
                        filterOptions["bpm"] = [...new Set(data.map((item) => parseInt(item.bpm)))].sort();
                    })

            })
    }, [username, follows])
    console.log(songs)


    for (let x of searchParams.entries()) {
        console.log(x)
        songs = songs.filter(song => { return song[x[0]] == x[1] })
    }

    let likeClick = async (songID, mode) => {
        const response = await fetch(`http://127.0.0.1:8000/api/like/${mode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({ "songID": songID, "userID": user.user_id })
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        else {
            // Change like button
            let changed_song = songs.filter(song => { return song.id == songID })
            console.log(changed_song)
        }
    }

    function updateFilter(option, choice) {
        let contains = selectedFilters[option].includes(choice)
        if (contains) {
            selectedFilters[option] = selectedFilters[option].filter(e => e != choice)
        }
        else {
            selectedFilters[option].push(choice)
        }

        songs = allSongs
        for (let x of Object.entries(selectedFilters)) {
            if (x[1].length > 0) {
                songs = allSongs.filter(song => { return x[1].includes(song[x[0]]) })
            }
        }
        setSongs(songs)
    }

    function openModal() {
        setShowModal(!showModal)
    }

    let navigate = useNavigate();
    let followerClick = async () => {
        console.log("Follow clicked")
        if (user) {
            if (sameUser) {
                navigate('/edit-profile')
            }
            else {
                let type = follows ? "unfollow" : "follow"
                console.log(type)
                const response = await fetch(`http://127.0.0.1:8000/api/follower/${type}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    'body': JSON.stringify({ "from": user.user_id, "to": profile.id })
                });
                if (!response.ok) {
                    throw new Error(`Error! status: ${response.status}`);
                }
                else {
                    setFollows(!follows)
                }
            }
        }
    }
    

    return (
        <section className="bg-zinc-950 min-h-[calc(100vh-56px)]" >
            <div class="">
                <div class="container mx-auto p-8">
                    <div class="grid grid-cols-5 sm:grid-cols-12 gap-6 px-1">
                        <div class="col-span-1 h-fit sm:col-span-1 bg-neutral-900 shadow p-6">
                            <div class="flex flex-col items-center">

                                <img src={profile && profile.image ? require("../images/profile-pics/" + profile.image.split('/')[profile.image.split('/').length - 1]) : null}
                                    class="w-full aspect-square drop-shadow-xl mb-4 shrink-0">
                                </img>

                                <h1 class="text-2xl font-bold text-slate-200 dark:text-white">{profile ? profile.username : null}</h1>
                                <h1 class="pb-2 text-slate-200 dark:text-white">{profile ? profile.first_name + " " + profile.last_name : null}</h1>
                                <h1 className='bg-[linear-gradient(180deg,_#FFF_33.333%,_#00966E_33.333%_66.666%,_#D62612_66.666%)]'></h1>

                                <div className='flex'>
                                    <div
                                        class="text-slate-200 my-2 mr-4 text-sm">
                                        {profile && profile.country ? profile.country : null}
                                    </div>
                                    <div
                                        class="text-slate-200 my-2 mr-4 text-sm">
                                        CountryFlag
                                    </div>
                                </div>


                                <div className="columns-3 w-full py-2 divide-x-2">
                                    <div className='items-right'>
                                        <h1 className='text-base text-center text-slate-200'>{profile && profile.followers ? profile.followers.length : null}</h1>
                                        <h1 className='text-base text-bold text-center text-slate-200'>Followers</h1>
                                    </div>
                                    <div className='items-center' >
                                        <h1 className='text-base text-center text-slate-200'>{profile && profile.following ? profile.following.length : null}</h1>
                                        <h1 className='text-base text-bold text-center text-slate-200'>Following</h1>
                                    </div>
                                    <div className='items-center'>
                                        <h1 className='text-base text-center text-slate-200'>{profile ? profile.plays : null}</h1>
                                        <h1 className='text-base text-bold text-center text-slate-200'>Plays</h1>
                                    </div>
                                </div>

                                <div className="flex pt-2">
                                    <a onClick={followerClick} class="flex-1 cursor-pointer mr-4 rounded-full bg-blue-700 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2">
                                        {sameUser ? "Edit" : follows ? "Unfollow" : "Follow"}
                                    </a>
                                    {!sameUser ?
                                        <button class="flex-1 rounded-full border-2 bg-gray-50 hover:bg-neutral-300 font-semibold text-black px-4 py-2">
                                            Message
                                        </button> : null}
                                </div>

                            </div>

                            <hr class="my-6 border-t  dark:border-white border-slate-100" />
                            <div class="flex flex-col">
                                <span class="text-slate-200 tracking-wider mb-2  dark:text-white">{profile ? profile.description : null}</span>
                            </div>
                        </div>

                        <div class="col-span-3 sm:col-span-9 ">
                            <h3 class="text-3xl text-slate-200 font-bold  mb-2">Tracks</h3>

                            <div class="w-full rounded-md mb-1">
                                <ul role="list" className=" border-gray-200 divide-y-2 divide-zinc-700">
                                    {songs.map((product, productIdx) => (
                                        <li key={product.id} className="flex relative w-full py-2 hover:bg-zinc-900">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={require("../images/music-pics/" + product.image.split('/')[product.image.split('/').length - 1])}
                                                    alt={product.title}
                                                    className="h-24 w-24 rounded-md object-cover object-center sm:h-40 sm:w-40"
                                                />
                                            </div>

                                            <div onClick= {() => updatePlayingSong(product)} className="ml-4 cursor-pointer flex flex-1 w-full h-full flex-col justify-between sm:ml-6">
                                                <div className="relative max-w-full pr-9 w-fit ">
                                                    <div className='items-center w-full max-w-fit'>
                                                        <div className="flex justify-between w-full max-w-fit">
                                                            <h3 className="text-m w-full max-w-fit">
                                                                <a href={`/track/${product.id}`} className="">
                                                                    <p className='text-m truncate w-full max-w-full text-slate-200 hover:underline hover:text-gray-400'>
                                                                        {product.title}
                                                                    </p>
                                                                </a>
                                                            </h3>
                                                        </div>
                                                        <div className="text-m">
                                                            <h3 className="text-sm w-fit">
                                                                <a href={`/profile/${product.user_obj.username}`}>
                                                                    <p className="text-m text-blue-700  hover:underline hover:text-blue-900">
                                                                        {product.user_obj.username}
                                                                    </p>
                                                                </a>
                                                            </h3>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <h3 className="text-sm text-slate-300">
                                                                {product.genre}
                                                            </h3>
                                                            <h3 className="text-sm text-slate-300">
                                                                {product.mood}
                                                            </h3>
                                                        </div>

                                                        <div className="text-m align-bottom">
                                                            <h3 className="text-sm flex gap-x-2">
                                                                <p className="text-gray-500 truncate">{product.tag1}</p>
                                                                <p className="text-gray-500 truncate">{product.tag2}</p>
                                                                <p className="text-gray-500 truncate">{product.tag3}</p>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-1 flex-col items-end absolute top-0 right-0 justify-between p-2">
                                                    <button
                                                        type="button"
                                                        onClick={openModal}
                                                        className="rounded-md bg-blue-700 py-1 w-min-1/5 w-max-1/4 w-fit font-medium text-sm text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                                                        <div className='flex gap-x-2 mx-2 items-stretch'>

                                                            {`$${product && product.licences ? product.licences[0].price : null}`}
                                                            <svg class="w-4 h-4 text-white text-sm font-medium my-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1" />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick=""
                                                        className="rounded-md bg-purple-500 mt-2 p-2 py-1 w-min-1/5 w-max-1/4 w-fit font-medium text-xs text-white shadow-sm hover:bg-fuchsia-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                                                        FREE
                                                    </button>

                                                    <div className='flex h-fit items-stretch py-1'>

                                                        <p className='text-sm text-slate-400 pt-1.5 pr-2'>{product.likes_obj.length}</p>
                                                        {product.likes_obj.some(e => e.user_id === user.user_id) ?
                                                            <button type="submit" onClick={() => likeClick(product.id, "remove")} className="rounded-md w-min-1/5 w-max-1/4 w-fit font-medium text-sm text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                                                                <div className='flex gap-x-2 py-1 items-stretch'>
                                                                    <svg class="w-6 h-6 text-red-500 hover:text-slate-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                                        <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                                                                    </svg>
                                                                </div>
                                                            </button>
                                                            :
                                                            <button type="submit" onClick={() => likeClick(product.id, "add")} className="rounded-md w-min-1/5 w-max-1/4 w-fit font-medium text-sm text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                                                                <div className='flex gap-x-2 py-1 items-stretch'>
                                                                    <svg class="w-6 h-6 text-slate-200 hover:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 19">
                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z" />
                                                                    </svg>
                                                                </div>
                                                            </button>
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                            {showModal ?
                                <div tabindex="-1" aria-hidden="true" class="fixed z-50 w-full justify-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                    <div id="default-modal" class="relative  border-2 place-self-center  w-full max-w-2xl max-h-full">
                                        <div class="relative bg-gray-900 rounded-lg shadow">
                                            <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                                <h3 class="text-xl font-semibold text-slate-200">
                                                    Select a licence
                                                </h3>
                                                <button onClick={() => setShowModal(false)} type="button" class="text-slate-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                    </svg>
                                                    <span class="sr-only">Close modal</span>
                                                </button>
                                            </div>
                                            <div class="p-6 space-y-6">
                                                <p class="text-base leading-relaxed text-slate-200 dark:text-gray-400">
                                                    Different licences will be shown here
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null}
                        </div>

                        <div class="col-span-1 sm:col-span-9 ">
                            {Object.keys(filterOptions).map(option => (

                                <div id={`accordion-flush-${option}`} data-accordion="collapse" data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-inactive-classes="text-gray-500 dark:text-gray-400">
                                    <h2 id={`heading-${option}`}>
                                        <button type="button" onClick={() => openFilter == option ? setOpenFilter(null) : setOpenFilter(option)}
                                            class="flex items-center justify-between w-full py-3 font-medium text-left text-slate-200 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400" data-accordion-target={`#body-${option}`} aria-expanded="true" aria-controls={`#body-${option}`}>
                                            <span>{option}</span>
                                            <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                                            </svg>
                                        </button>
                                    </h2>
                                    {openFilter && openFilter == option ?
                                        <div id={`body-${option}`} aria-labelledby={`heading-${option}`}>
                                            <div class="py-2 border-b border-gray-200 dark:border-gray-700">
                                                {filterOptions[option].map(choice => (
                                                    <div class="flex  items-center ">
                                                        <input id={`checkbox-${choice}`} onChange={() => updateFilter(option, choice)} type="checkbox"
                                                            defaultChecked={selectedFilters[option].includes(choice) ? "defaultChecked" : null} value="true" class="w-4 h-4 text-blue-600 border-transparent ring-0 focus:ring-0 bg-gray-800 border-gray-800 rounded" />
                                                        <label htmlFor={`checkbox-${choice}`} class="ml-2 text-sm font-medium text-slate-200 dark:text-gray-300">{choice}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {playingSong ? 
                <div className="sticky bottom-0">
                    <CustomPlayer song={playingSong}/>
                </div>
            : null}
        </section>
    );
}