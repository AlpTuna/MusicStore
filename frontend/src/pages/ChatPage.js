import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';

const ChatPage = () => {
    let { user } = useContext(AuthContext)
    let [profiles, setProfiles] = useState([]);
    let [selectedProfile, setSelectedProfile] = useState(null);
    let [messages, setMessages] = useState([]);
    React.useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/get_messages/?mode=all&user=${user.user_id}`)
            .then(res => res.json())
            .then(data2 => {
                setProfiles(data2)
            })

    }, [user])
    console.log("profiles: ", profiles)

    React.useEffect(() => {
        if (selectedProfile) {
            fetch(`http://127.0.0.1:8000/api/get_messages/?mode=chat&user1=${user.user_id}&user2=${selectedProfile.id}`)
                .then(res => res.json())
                .then(data2 => {
                    setMessages(data2)
                    console.log(data2)
                })

        }
    }, [selectedProfile])

    let sendMessage = async () => {
        if(selectedProfile){
            const response = await fetch(`http://127.0.0.1:8000/api/get_messages/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                'body': JSON.stringify(
                    {"sender": user.user_id, 
                    "receiver": selectedProfile.id,
                    "context" : document.getElementById("chatInput").value}
                    )
            });
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            else {
                //This is to refresh the messages, however; should be changed so that only new message is added. (to avoid overloading)
                setSelectedProfile(selectedProfile)
                let newData = {
                    "context":document.getElementById("chatInput").value,
                    "date": new Date(),
                    "sender":user.user_id,
                    "receiver":selectedProfile.id
                }
                setMessages(messages => [...messages,newData])
                document.getElementById("chatInput").value = ""
            }
        }
    }



    return (
        <section className='bg-zinc-950 min-h-[calc(100vh-56px)]'>

            <div class="">
                <div class="container mx-auto p-8">
                    <div class="grid grid-cols-5 gap-6 px-1">
                        <div class="col-span-2 border border-xxl h-fit bg-neutral-900 shadow p-6">
                            <div class="grid grid-cols-1 divide-y-2">
                                {profiles ? profiles.map((profile) => (
                                    <div className="justify-items-start py-2 flex hover:bg-neutral-800 cursor-pointer" onClick={() => setSelectedProfile(profile)}>

                                        <img src={profile && profile.image ? require("../images/profile-pics/" + profile.image.split('/')[profile.image.split('/').length - 1]) : null}
                                            className="h-10 w-10 rounded-full self-center object-cover object-center mx-2">
                                        </img>
                                        <h1 className="text-lg text-slate-200 my-2">{profile.username}</h1>

                                    </div>
                                )) : null}
                            </div>
                        </div>

                        <div class="col-span-3 border border-xxl h-fit bg-neutral-900 shadow p-6">
                            <div class="flex flex-col items-center">
                                {selectedProfile ?
                                    messages.map((message) => (
                                        <div className={`align-self-${message.sender == user.user_id ? "end" : "start"}`}>
                                            <div className="flex flex-col gap-1 w-full max-w-[320px]">
                                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <span className="align-self-end text-sm font-normal text-gray-500 dark:text-gray-400">
                                                    {(new Date(message.date)).getHours()}:{('0'+(new Date(message.date)).getMinutes()).slice(-2)}
                                                    </span>
                                                </div>
                                                <div className={`flex flex-col leading-1.5 p-2 border-gray-200 ${message.sender == user.user_id ? "bg-blue-400" : "bg-neutral-800"} rounded-e-xl rounded-es-xl dark:bg-gray-700`}>
                                                    <p className={`text-sm font-normal ${message.sender == user.user_id ? "text-black" : "text-gray-200"}`}>{message.context}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    <h1 className='text-lg text-slate-200'>Select a profile to see the messages</h1>
                                }
                            </div>
                            {selectedProfile ? 
                            <div class="mt-3">
                                <textarea
                                    class="text-slate-200 bg-neutral-800 rounded-lg leading-normal resize-none h-fit w-full px-2 font-medium placeholder-neutral-400 focus:outline-none focus:bg-slate-750"
                                    id="chatInput" name="body" placeholder='Send a message' required>
                                </textarea>
                                <input type='submit' onClick={() => sendMessage()} class="px-2.5 py-1.5 pb-1 rounded-sm text-white text-sm bg-indigo-500" value={"Send"} />
                            </div>
                            : null}
                        </div>

                    </div>
                </div>
            </div>
        </section>

    )
}
export default ChatPage