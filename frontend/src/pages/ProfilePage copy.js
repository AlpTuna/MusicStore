import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, XMarkIcon as XMarkIconMini } from '@heroicons/react/20/solid'
import {
    MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBBreadcrumb, MDBBreadcrumbItem, MDBProgress,
    MDBProgressBar, MDBIcon, MDBListGroup, MDBListGroupItem
} from 'mdb-react-ui-kit';

export default function ProfilePage() {

    let { username } = useParams();
    let { user } = React.useContext(AuthContext)
    let data, userID;
    const [sameUser, setSame] = useState(false);
    let [songs, setSongs] = useState([])
    const [follows, setFollows] = useState(null);
    let [profile, setProfile] = useState(null);

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
                        console.log(data)
                        setSongs(data)
                    })

            })
        console.log(profile)
    }, [username, follows])
    console.log(sameUser, follows)






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
                    <h1 class="text-2xl font-bold text-slate-200 dark:text-white">User Profile</h1>
                    <div class="h-min-1/5 h-fit items-left  bg-neutral-900 shadow rounded-xl my-2 px-10 p-6">
                        <div class="flex flex-col">

                            <div class="grid grid-cols-4 sm:grid-cols-12 gap-2 px-1">
                                <div class="col-span-1 sm:col-span-9 ">
                                    <img src={profile && profile.image ? require("../images/profile-pics/" + profile.image.split('/')[profile.image.split('/').length - 1]) : null}
                                        class="w-32 h-32  rounded-xl drop-shadow-xl mb-4 shrink-0">
                                    </img>
                                </div>

                                <div class="col-span-1 sm:col-span-9 ">
                                    <h1 class="text-2xl font-bold text-slate-200 dark:text-white">{profile ? profile.username : null}</h1>
                                    <h1 class="pb-2 text-slate-200 dark:text-white">{profile ? profile.first_name + " " + profile.last_name : null}</h1>
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
                                </div>
                                <div class="col-span-1 sm:col-span-9 ">
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
                                            <button class="flex-1 rounded-full border-2 bg-gray-50 hover:border-slate-500 hover:bg-slate-500 font-semibold text-black px-4 py-2">
                                                Message
                                            </button> : null}
                                    </div>

                                </div>

                            <div class="col-span-1 sm:col-span-9 ">
                                <div class="flex flex-col">
                                    <span class="text-slate-200 tracking-wider mb-2  dark:text-white">{profile ? profile.description : null}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-1">

                        <div class="col-span-3 sm:col-span-9 ">
                            <h3 class="text-3xl text-slate-200 font-bold  mb-2">Tracks</h3>

                            <div class="w-full rounded-md mb-1 border-2">
                                <ul role="list" className=" border-gray-200">
                                    {songs.map((product, productIdx) => (
                                        <li key={product.id} className="flex py-6 sm:py-10">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={require("../images/music-pics/" + product.image.split('/')[product.image.split('/').length - 1])}
                                                    alt={product.title}
                                                    className="h-20 w-20 rounded-md object-cover object-center sm:h-40 sm:w-40"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <h3 className="text-m">
                                                                <a href={`/track/${product.id}`} className="text-m text-slate-200 hover:text-gray-800">
                                                                    {product.title}
                                                                </a>
                                                            </h3>
                                                        </div>
                                                        <div className="text-m">
                                                            <h3 className="text-sm">
                                                                <a href={`profile/${product.user_obj.username}`} className="text-m text-blue-700 hover:text-gray-800">
                                                                    {product.user_obj.username}
                                                                </a>
                                                            </h3>
                                                        </div>
                                                        <div className="text-m">
                                                            <h3 className="text-sm flex divide-x-2">
                                                                <div
                                                                    data-te-chip-init
                                                                    data-te-ripple-init
                                                                    class="[word-wrap: break-word] hover:underline mr-4 flex cursor-pointer items-center justify-between text-xs rounded-[12px] bg-slate-800 px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-slate-200 shadow-none transition-[opacity] duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1]"
                                                                    data-te-close="true">
                                                                    #{product.tag1}
                                                                </div>
                                                                <p className="text-gray-500">{product.tag2}</p>
                                                                <p className="text-gray-500">{product.tag3}</p>
                                                            </h3>
                                                        </div>
                                                        <div className="text-m">
                                                            <h3 className="text-sm">
                                                                <p className="text-gray-200">{product.price} $</p>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}