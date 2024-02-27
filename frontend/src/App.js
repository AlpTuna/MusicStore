import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SignupPage from './pages/SignupPage'
import CreateMusicPage from './pages/CreateMusic'
import SongPage from './pages/SongPage'
import Header from './components/Header'
import EditProfile from './pages/EditProfile';
import ChatPage from './pages/ChatPage';
import CartPage from './pages/CartPage';
import { PlayingProvider } from './context/PlayingContext';


function App() {

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <PlayingProvider>
            <Header />
            <Routes>
              <Route exact path="/" element={<PrivateRoute> <HomePage /> </PrivateRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/create-music" element={<PrivateRoute> <CreateMusicPage /></PrivateRoute>} />
              <Route path="/edit-profile" element={<PrivateRoute> <EditProfile /></PrivateRoute>} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/track/:id" element={<SongPage />} />
              <Route path="/messages" element={<ChatPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </PlayingProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
