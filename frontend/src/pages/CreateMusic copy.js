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

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CreateMusic() {

  let {user} = React.useContext(AuthContext)
  let licenses = [];
    
  async function fetchData() {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get_user_licenses/?userID=${user.user_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
      const data = await response.json();
      licenses = data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  fetchData();
        
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let formdata = new FormData()
    data.append("owner",user.user_id)
    data.append("mood",document.getElementById("combo-box-mood").value)
    data.append("genre",document.getElementById("combo-box-genre").value)
    formdata.append("image",document.querySelector("#photoButton").files[0])
    formdata.append("audiofile",document.querySelector("#audioButton").files[0])
    for(const name of data.entries()) {
      //console.log(name[0],name[1])
      formdata.append(name[0], name[1]);
    }
    for(const name of formdata.entries()){
      console.log(name[0],name[1])
    }

    let newImage = await fetch("http://127.0.0.1:8000/api/create_music/",{
      method : 'POST',
      "Content-Type":"multipart/form-data",
      body : formdata
    })
    .then(response => response.json()).catch(error => console.error(error))

  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop:1 ,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LibraryMusicIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create a Music {user.name}
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2} alignContent="baseline">
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                    autoComplete="title"
                    name="title"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                    autoComplete="tag1"
                    name="tag1"
                    required
                    fullWidth
                    id="tag1"
                    label="Tag1"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                    autoComplete="tag2"
                    name="tag2"
                    required
                    fullWidth
                    id="tag2"
                    label="Tag2"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                    autoComplete="tag3"
                    name="tag3"
                    required
                    fullWidth
                    id="tag3"
                    label="Tag3"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                <Typography>Audio</Typography>
                  <input type = "file" id = "audioButton"/>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Cover Photo</Typography>
                    <input type = "file" id = "photoButton"/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete 
                        disablePortal
                        required
                        fullWidth
                        id="combo-box-genre"
                        options={['Hip Hop','Pop','R&B','Rock','Electronic','Lofi','Drill','Country']}
                        sx={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} label="Genre" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        disablePortal
                        required
                        fullWidth
                        id="combo-box-mood"
                        options={['None','Angry','Bouncy','Calm','Confident','Depressed','Energetic',
                            'Epic','Evil','Happy','Inspiring','Intense','Mellow','Peaceful','Sad','Soulful']}
                        sx={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} label="Mood" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="description"
                        label="Description"
                        name="description"
                        autoComplete="description"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        id="bpm"
                        label="BPM"
                        name="bpm"
                        autoComplete="bpm"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        fullWidth
                        id="key"
                        label="Key"
                        name="key"
                        autoComplete="key"
                    />
                </Grid>
                  {licenses.map((license) => (
                    <p>{license}</p>
                  ))}
                </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt:1}} />
      </Container>
    </ThemeProvider>
  );
}