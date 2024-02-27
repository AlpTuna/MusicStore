import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { ClassNames } from '@emotion/react';

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const cards = [];

const Album = () => {

  const defaultTheme = createTheme();
  let [songs, setSongs] = React.useState([])

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/music/', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        setSongs(data.slice(0,5));
      })
  }, [])
  console.log(songs)

  function songClick(id) {
    //event.preventDefault();
    console.log('Song Clicked', id)

  }

return (
  <section className='bg-slate-900 h-fit min-h-[calc(100vh-56px)]'>
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-2 lg:pt-16">

      <div className="md:items-center md:justify-between pb-4">
        <h2 id="favorites-heading" className="text-2xl font-bold tracking-tight text-slate-200">
          Recent Beats
        </h2>
        <div className="border-2 rounded-lg border-blue-600/60 mt-2 flex p-2 grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-8 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
          {songs.map((song) => (
            <div key={song.id} className="relative">
              <div className="group h-60 w-60 block overflow-hidden rounded-lg">
                <img src={require("../images/music-pics/" + song.image.split('/')[song.image.split('/').length - 1])} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                <button type="button" onClick={() => songClick(song.id)} className="absolute h-60 w-60 inset-0 focus:outline-none"></button>
              </div>
              <a href={"/track/" + song.id} className="text-m font-medium text-slate-200">{song.title}</a>
              <a href={"/profile/" + song.user_obj.username} className="block text-sm font-medium text-slate-400">{song.user_obj.username}</a>
            </div>
          ))}
        </div>
      </div>




      <div className="mt-8 text-sm md:hidden">
        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
          See more
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>

    </div>
  </section>
);
}

export default Album;