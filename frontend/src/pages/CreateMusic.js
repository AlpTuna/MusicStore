import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthContext from '../context/AuthContext';

export default function CreateMusic() {

  let { user } = React.useContext(AuthContext)
  let [licenses, setLicenses] = React.useState([]);
  let [a1Input, seta1Input] = React.useState(null);
  let [a2Input, seta2Input] = React.useState(null);
  let [imInput, setimInput] = React.useState(null);
  let [freeEnabled, setFreeEnabled] = React.useState(false)
  console.log(user)

  React.useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/get_user_licenses/${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        setLicenses(data)
      })
  }, [])
  console.log(licenses)

  function inputChange(event) {
    if (event.target.id == "audio-file-1") {
      seta1Input(event.target.files[0])
    }
    else if (event.target.id == "audio-file-2") {
      seta2Input(event.target.files[0])
    }
    else if (event.target.id == "image-file") {
      setimInput(event.target.files[0])
    }
  }

  const handleSubmit = async () => {
    const data = new FormData();

    let formdata = new FormData()
    data.append("owner", user.user_id)
    data.append("title", document.getElementById("title").value)
    data.append("genre", document.getElementById("genre").value)
    data.append("bpm", document.getElementById("bpm").value)
    data.append("key", document.getElementById("key").value)
    data.append("mood", document.getElementById("mood").value)
    data.append("audiofile1", document.getElementById("audio-file-1").files[0])
    data.append("audiofile2", document.getElementById("audio-file-2").files[0])
    data.append("imagefile", document.getElementById("image-file").files[0])
    data.append("freeDownload", freeEnabled)
    //formdata.append("image", document.querySelector("#photoButton").files[0])
    //formdata.append("audiofile", document.querySelector("#audioButton").files[0])
    for (const name of data.entries()) {
      //console.log(name[0],name[1])
      formdata.append(name[0], name[1]);
    }
    for (var pair of data.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    /*
    let newImage = await fetch("http://127.0.0.1:8000/api/create_music/", {
      method: 'POST',
      "Content-Type": "multipart/form-data",
      body: formdata
    })
      .then(response => response.json()).catch(error => console.error(error))
      */
  }

  return (
    <section className='bg-zinc-950 h-fit min-h-[calc(100vh-56px)]'>
      <div class="">
        <div class="container mx-auto p-8">
          <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-1">
            <div class="col-span-4 h-fit sm:col-span-4 shadow rounded-xl px-6 mx-4 mb-4">
              <h3 className='text-xl text-bold text-slate-200'>Track Details</h3>

              <div className='my-2 bg-neutral-900 px-3 py-3'>
                <div class="grid grid-cols-5 sm:grid-cols-12 gap-6 px-1">

                  <div class="col-span-3 h-fit sm:col-span-4 rounded-xl">
                    <div class="mb-4">
                      <label for="title" class="mb-2 text-xl font-medium text-slate-200 dark:text-white">Title</label>
                      <input id="title" class="bg-neutral-700 active:border-0 placeholder:text-neutral-300 border-0 rounded-lg text-slate-200 text-sm block w-full p-2.5 " placeholder="Track Title" required />
                    </div>
                    <div class="mb-4">
                      <label for="tags" class="block mb-2 text-xl font-medium text-slate-200 dark:text-white">Tags</label>
                      <input id="tags" class="bg-neutral-700 active:border-0 placeholder:text-neutral-300 border-0 rounded-lg text-slate-200 text-sm block w-full p-2.5 " placeholder="Tags" required />
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-12 gap-6 px-1">
                      <div class="col-span-1 h-fit sm:col-span-4 rounded-xl">
                        <div class="mb-4">
                          <label for="genre" class="mb-2 text-xl font-medium text-slate-200 dark:text-white">Genre</label>
                          <input id="genre" class="bg-neutral-700 active:border-0 placeholder:text-neutral-300 border-0 rounded-lg text-slate-200 text-sm block w-full p-2.5 " placeholder="Genre" required />
                        </div>
                      </div>
                      <div class="col-span-1 h-fit sm:col-span-4 rounded-xl">
                        <div class="mb-4">
                          <label for="mood" class="mb-2 text-xl font-medium text-slate-200 dark:text-white">Mood</label>
                          <input id="mood" class="bg-neutral-700 active:border-0 placeholder:text-neutral-300 border-0 rounded-lg text-slate-200 text-sm block w-full p-2.5 " placeholder="Mood" required />
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-12 gap-6 px-1">
                      <div class="col-span-1 h-fit sm:col-span-4 rounded-xl">
                        <div class="mb-4">
                          <label for="bpm" class="mb-2 text-xl font-medium text-slate-200 dark:text-white">BPM</label>
                          <input id="bpm" class="bg-neutral-700 active:border-0 placeholder:text-neutral-300 border-0 rounded-lg text-slate-200 text-sm block w-full p-2.5 " placeholder="BPM" required />
                        </div>
                      </div>
                      <div class="col-span-1 h-fit sm:col-span-4 rounded-xl">
                        <div class="mb-4">
                          <label for="key" class="mb-2 text-xl font-medium text-slate-200 dark:text-white">Key</label>
                          <input id="key" class="bg-neutral-700 active:border-0 placeholder:text-neutral-300 border-0 rounded-lg text-slate-200 text-sm block w-full p-2.5 " placeholder="Key" required />
                        </div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label for="description" class="mb-2 text-xl font-medium text-slate-200 dark:text-white">Description</label>
                      <textarea id="description" class="bg-neutral-700 active:border-0 placeholder:text-neutral-300 rounded-lg  text-slate-200 text-sm block w-full p-2.5 " placeholder="Description" required />
                    </div>

                  </div>

                  <div class="col-span-1 h-fit sm:col-span-4 rounded-xl">
                    <label for="audioFile" class="mb-2 text-xl font-medium text-slate-200 dark:text-white">Audio File</label>

                    <div class="flex items-center mb-4 justify-center w-full">
                      <label class="flex flex-col items-center h-full justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-neutral-800 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-neutral-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center w-full px-2 justify-center py-3">
                          {a1Input ? <p class="text-base align-center w-full truncate text-gray-300 dark:text-gray-400">{a1Input.name}</p> : (
                            <>
                              <svg class="w-8 h-8 mb-1 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                              </svg>
                              <p id="a1-text" class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">.mp3, .wav</p>
                            </>
                          )}
                        </div>
                        <input type="file" onChange={inputChange} accept=".mp3, .wav" id="audio-file-1" name="file_upload" class="hidden" />
                      </label>
                    </div>

                    <label for="audioFile" class="mb-2 text-xl font-medium text-slate-200 dark:text-white">Stem Files</label>
                    <div class="flex items-center mb-4 justify-center w-full">
                      <label class="flex flex-col items-center h-full justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-neutral-800 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-neutral-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center w-full px-2 justify-center py-3">
                          {a2Input ? <p class="text-base truncate text-gray-300 w-full dark:text-gray-400">{a2Input.name}</p> : (
                            <>
                              <svg class="w-8 h-8 mb-1 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                              </svg>
                              <p id="a1-text" class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">.zip, .rar</p>
                            </>
                          )}
                        </div>
                        <input type="file" onChange={inputChange} accept=".zip, .rar" id="audio-file-2" name="file_upload" class="hidden" />
                      </label>
                    </div>
                  </div>

                  <div class="col-span-1 h-fit sm:col-span-4 rounded-xl">
                    <label for="audioFile" class="mb-2 text-xl font-medium text-slate-200 dark:text-white">Image File</label>

                    <div class="flex items-center mb-4 justify-center w-full">
                      <label class="flex flex-col items-center h-full justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-neutral-800 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-neutral-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center py-3">
                          {imInput ? (<img src={URL.createObjectURL(imInput)}></img>) : (
                            <>
                              <svg class="w-8 h-8 mb-1 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                              </svg>
                              <p id="a1-text" class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">.jpeg, .png, .jpg</p>
                            </>
                          )}
                        </div>
                        <input type="file" onChange={inputChange} accept=".jpeg, .png, .jpg" id="image-file" name="file_upload" class="hidden" />
                      </label>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-1 mb-4">
            <div class="col-span-4 h-fit sm:col-span-4 shadow rounded-xl px-6 mx-4">
              <h3 className='text-xl text-bold text-slate-200'>Store Listing</h3>

              <div className='my-2 bg-neutral-900 px-3 py-3'>
                <div class="grid grid-cols-2 sm:grid-cols-12 gap-6 px-1">
                  <div class="col-span-1 h-fit sm:col-span-4 rounded-xl">
                    {licenses.map((license) => (
                      <div class="mb-4">
                        <label for={license.name} class="mb-2 text-xl font-medium text-slate-200 dark:text-white">{license.name}</label>
                        <input id={license.name} class="bg-neutral-700 active:border-0 placeholder:text-neutral-500 border-0 rounded-lg text-slate-200 text-sm block w-full p-2.5 " defaultValue={license.default_price} placeholder={license.default_price} required />
                      </div>
                    ))}
                  </div>

                  <div class="col-span-1 h-fit sm:col-span-4 rounded-xl">
                    <label class="mb-2 text-xl font-medium text-slate-200 dark:text-white">Free Download</label>
                    <div class="flex items-center mb-4">
                      <input id="default-radio-1" type="radio" value="" name="default-radio" class="w-4 h-4 text-indigo-600 bg-gray-100" />
                      <label for="default-radio-1" class="ml-2 text-sm font-medium text-slate-200 dark:text-gray-300">No, I don't want to allow free download</label>
                    </div>
                    <div class="flex items-center">
                      <input checked id="default-radio-2" type="radio" value="" name="default-radio" class="w-4 h-4 bg-gray-100 border-gray-300  dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label for="default-radio-2" class="ml-2 text-sm font-medium text-slate-200 dark:text-gray-300">Yes, I want to allow free download</label>
                    </div>
                  </div>

                </div>
              </div>
              <button type="submit" onClick={handleSubmit} class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}