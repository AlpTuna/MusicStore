import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';
import { useParams } from 'react-router-dom'


import {
    MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBBreadcrumb, MDBBreadcrumbItem, MDBProgress,
    MDBProgressBar, MDBIcon, MDBListGroup, MDBListGroupItem
} from 'mdb-react-ui-kit';
import { Typography } from '@mui/material';

import { Fragment } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'

import { Disclosure, RadioGroup, Tab } from '@headlessui/react'
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

import { CheckCircleIcon } from '@heroicons/react/20/solid'


const SongPage = () => {
    let { id } = useParams();
    let { user } = useContext(AuthContext)
    let [songs, setSongs] = React.useState([])
    var keys = [];
    let [product, setVals] = useState([])

    const [selectedLicense, setSelectedLicense] = useState(null)
    let [likes, setLikes] = useState(false)

    React.useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/similar_songs/${id}`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                setSongs(data.slice(0, 6)); //This returns only the first 6 songs
            })
    }, [])
    console.log(songs)

    function songClick(id) {
        //event.preventDefault();
        console.log('Song Clicked', id)

    }

    React.useEffect(() => {
        fetch('http://127.0.0.1:8000/api/get_music/' + id)
            .then(res => res.json())
            .then(data => {
                setVals(data);
                //setLikes(data.likes.includes(user.user_id))
                setLikes(false)
                setSelectedLicense(data.licences[0].id)
            })
    }, [])
    console.log(product)

    let cartButtonClick = async (e) => {
        e.preventDefault()

        console.log("Add to cart clicked", selectedLicense)

        const response = await fetch('http://127.0.0.1:8000/api/update_cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            'body': JSON.stringify({
                "userID": user.user_id,
                "licenseID": selectedLicense
            })
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        } else {
            //navigate(`/profile/${user.username}`)
        }

    }

    let submitClick = async (e) => {
        e.preventDefault()
        console.log({
            "context": document.getElementById("commentInput").value,
            "userID": user.user_id,
            "songID": product.id
        })


        /*const response = await fetch('http://127.0.0.1:8000/api/add_comment/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            'body': JSON.stringify({
                "context": document.getElementById("commentInput").value,
                "userID": user.user_id,
                "songID": product.id
            })
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        } else {
            //navigate(`/profile/${user.username}`)
        }
        */
    }

    return (
        <section className='bg-zinc-950 h-fit min-h-[calc(100vh-56px)]'>
            <div class="">
                <div class="container mx-auto py-8">
                    <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-1">
                        <div class="col-span-1 h-fit sm:col-span-1 bg-neutral-900 drop-shadow-2xl shadow-indigo-700/25 rounded-xl p-6">
                            <div class="flex flex-col items-center">
                                <img src={product.image ? require("../images/music-pics/" + product.image.split('/')[product.image.split('/').length - 1]) : null}
                                    class="w-64 h-64 , rounded-xl drop-shadow-xl mb-4 shrink-0">
                                </img>

                                <p class="text-2xl text-center font-semibold w-full text-slate-200 dark:text-white">{product.title}</p>
                                <a href={product.user_obj ? "/profile/" + product.user_obj.username : null} class="pb-2 text-slate-200 dark:text-white">{product.user_obj ? product.user_obj.username : null}</a>

                                <div className='flex gap-x-4'>
                                    <h1 className='pb-2 text-slate-200'>{product.genre}</h1>
                                    <h1 className='pb-2 text-slate-200'>{product.mood}</h1>
                                </div>

                                <div className='flex'>
                                    <div
                                        data-te-chip-init
                                        data-te-ripple-init
                                        class="[word-wrap: break-word] hover:underline my-[5px] mr-4 flex h-[32px] cursor-pointer items-center justify-between rounded-[16px] bg-slate-800 px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-slate-200 shadow-none transition-[opacity] duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] dark:bg-neutral-600 dark:text-neutral-200"
                                        data-te-close="true">
                                        #{product.tag1}
                                    </div>
                                    <div
                                        data-te-chip-init
                                        data-te-ripple-init
                                        class="[word-wrap: break-word] hover:underline my-[5px] mr-4 flex h-[32px] cursor-pointer items-center justify-between rounded-[16px] bg-slate-800 px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-slate-200 shadow-none transition-[opacity] duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] dark:bg-neutral-600 dark:text-neutral-200"
                                        data-te-close="true">
                                        #{product.tag2}
                                    </div>
                                    <div
                                        data-te-chip-init
                                        data-te-ripple-init
                                        class="[word-wrap: break-word] hover:underline my-[5px] mr-4 flex h-[32px] cursor-pointer items-center justify-between rounded-[16px] bg-slate-800 px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-slate-200 shadow-none transition-[opacity] duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] dark:bg-neutral-600 dark:text-neutral-200"
                                        data-te-close="true">
                                        #{product.tag3}
                                    </div>
                                </div>

                            </div>
                            <hr class="my-6 border-t  dark:border-white border-slate-100" />
                            <div class="flex flex-col">
                                <span class="text-slate-200 mb-2  dark:text-white">{product.description}</span>
                            </div>
                        </div>
                        <div class="col-span-3 sm:col-span-9">

                            <div class="rounded-x px-6 pb-6">
                                <div className='flex'>
                                    <h3 class="text-3xl text-slate-200 font-bold mb-2">Licences</h3>

                                </div>
                                <div class="w-full  rounded-md mb-1 ">
                                    <ul class="grid w-full text-left gap-2 md:grid-cols-3">
                                        {product.licences ? product.licences.map((licence) => (
                                            <li>
                                                <input type="radio" onChange={() => setSelectedLicense(licence.id)} id={licence.id} name="licenseRadio" value={licence.id} class="hidden peer" required />
                                                <label for={licence.id} class={`inline-flex items-center justify-between w-full p-3 text-gray-600 bg-${selectedLicense == licence.id ? "gradient-to-b from-blue-800" : "slate-800"} rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 active:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-slate-700 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}>
                                                    <div class="block">
                                                        <div class="w-full text-slate-200 text-lg font-semibold">{licence.license_obj.name}</div>
                                                        <div class="w-full text-slate-200">{licence.price} USD</div>
                                                    </div>
                                                </label>
                                            </li>
                                        )) : null}
                                    </ul>
                                    <button type="button" onClick={cartButtonClick}
                                        className="my-3 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Add to cart
                                    </button>

                                </div>

                                <hr class="my-6 border-t  dark:border-white border-slate-100" />
                                <h3 class="text-3xl text-slate-200 font-bold  mb-4">Comments</h3>
                                <div class="w-full rounded-md ">
                                    <form onSubmit={submitClick}>
                                        <div class="flex w-full">
                                            <img
                                                src={user.image ? require("../images/profile-pics/" + user.image.split('/')[user.image.split('/').length - 1]) : null}
                                                class="object-cover w-10 h-10 rounded-full border-2 border-black  shadow-emerald-400" />
                                            <textarea
                                                class=" mx-3 text-slate-300 bg-slate-800 rounded-lg leading-normal resize-none w-full h-11 px-2 font-medium placeholder-slate-400 focus:outline-none focus:bg-slate-750"
                                                id="commentInput" name="body" placeholder='Type Your Comment' required>
                                            </textarea>
                                            <input type='submit' class="px-2.5 py-1.5 pb-1 rounded-md text-white text-sm bg-indigo-500" value={"Send"} />
                                        </div>
                                    </form>

                                    <div class="py-3 flex flex-col">
                                        {product.comments_obj ? product.comments_obj.slice(0, 2).map((comment) => (
                                            <div class="">
                                                <div class="flex gap-2 items-center">
                                                    <img
                                                        src={comment.user_obj.image ? require("../images/profile-pics/" + comment.user_obj.image.split('/')[comment.user_obj.image.split('/').length - 1]) : null}
                                                        class="object-cover ml-5 w-8 h-8 rounded-full border-2 border-black  shadow-emerald-400" />
                                                    <a class="font-bold text-slate-200 text-lg mt-1 text-justify align-middle" href={"/profile/" + comment.user_obj.username}>
                                                        {comment.user_obj.username}
                                                    </a>
                                                </div>
                                                <p class="text-slate-300 mt-2 ml-5">
                                                    {comment.context}
                                                </p>
                                            </div>
                                        )) : null}
                                    </div>
                                </div>

                                <hr class="my-6 border-t  dark:border-white border-slate-100" />
                                <h3 class="text-2xl text-slate-200 font-bold mt-3 mb-2">Related Tracks (Sorted by relevance)</h3>
                                <div class="w-full">
                                    <div className="flex grid-cols-2 gap-x-2 gap-y-10 sm:gap-x-2 md:grid-cols-4 md:gap-y-0 lg:gap-x-2">
                                        {songs.map((song) => (
                                            <div key={song.id} className="relative h-40 w-40">
                                                <div className="group h-40 w-40 block overflow-hidden rounded-lg bg-gray-100 ">
                                                    <img src={require("../images/music-pics/" + song.image.split('/')[song.image.split('/').length - 1])} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                                    <button type="button" onClick={() => songClick(song.id)} className="h-40 w-40 absolute inset-0  focus:outline-none"></button>
                                                </div>
                                                <a href={"/track/" + song.id} >
                                                    <p className="text-m hover:underline truncate font-medium text-slate-200">{song.title}</p>
                                                </a>
                                                <a href={"/profile/" + song.user_obj.username} >
                                                    <p className="block hover:underline text-sm font-medium text-slate-400">{song.user_obj.username}</p>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SongPage