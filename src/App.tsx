import React, { useState, useEffect } from "react"; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css"
import PlayList from "./components/playList/PlayList";
import { isMobile } from 'react-device-detect';
import HomeMobile from "./components/Mobile/Home/Home";
import PlaylistPage from "./components/Mobile/PlayListe/PlayList";
import ArtistPageMobile from "./components/Mobile/artistPage/ArtistPageMobile";
import UserProfile from "./components/Mobile/userProfileMobile/UserProfileMobile";
import EditProfileMobile from "./components/Mobile/userProfileMobile/editeProfileMobile";
import SettingsPage from "./components/Mobile/userProfileMobile/Settings";
import SearchPageMobile from "./components/Mobile/SearchPageMobile/SearchPageMobile";
import LibraryPage from "./components/Mobile/Library/Library";
import NotificationPage from "./components/Mobile/notification/Notificationpage";
import Register from "./components/Mobile/Auth/Register";
import AddMusicMobile from "./components/Mobile/AddSong/AddMusicMobile";
import LikedSongsPage from "./components/Mobile/LikeSong/LikeSong";
import PlaylistDetailPage from "./components/Mobile/PlaylistDetailPage/PlaylistDetailPage";
import OfflineMusic from "./components/Mobile/OfflineMusic/OfflineMusic";
import AlbumDetailPage from "./components/Mobile/album/AlbumDetailPage";
import { getToken } from "firebase/messaging";
import { messaging } from './firebase';
import api from "./api/axios";
import BecomeArtist from "./components/Mobile/BecomeArtist/BecomeArtist";
import ConfirmEmail from "./components/Mobile/ConfirmEmail/ConfirmEmail";
function App() {
  
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          
          const token = await getToken(messaging, {
            vapidKey: "BK6mtK2hIrhmuNNd7JqltgQ3Vzqpakgf73Yf5lyqn_hc2U5759oJy2mbEIuEPjtq86GTE1B5CC5dLtuvSPYjvuE"
          });

          if (token) {
            
            await api.post('/notifications/update-token', { token });
            console.log("Push Token sove ak siksè!", token);
          }
        }
      } catch (error) {
        console.error("Erè notifikasyon:", error);
      }
    };

    requestPermission();
  }, []);

  const routes = [
    {
      path: "/",
      element: (
        <>

          {!isOnline && isMobile ? (
            <OfflineMusic isRedirected={true} />
          ) : (
            isMobile ? <HomeMobile /> : ""
          )}
        </>
      ),
      withBottomNav: true
    },

    { path: "/playlist", element: <PlayList />, withBottomNav: true },
    {
      path: "/atis/:id", element:
        <>
          {isMobile ? <ArtistPageMobile /> : ""}
        </>
      , withBottomNav: true
    },
    {
      path: "/song", element: <>
        <div className=""><PlaylistPage /></div>
      </>, withBottomNav: true
    },
    {
      path: "/search", element: <>
        <div className=""><>{isMobile ? <SearchPageMobile /> : ""}</></div>
      </>, withBottomNav: true
    },
    {
      path: "/library", element: <>
        <div className=""><>{isMobile ? <LibraryPage /> : ""}</></div>
      </>, withBottomNav: true
    },
    {
      path: "/notifications", element: <>
        <div className=""><>{isMobile ? <NotificationPage /> : ""}</></div>
      </>, withBottomNav: true
    },
    {
      path: "/profile", element: <>
        <div className=""><>
          {isMobile ? <UserProfile /> : ""}
        </></div>
      </>, withBottomNav: true
    },
    {
      path: "/editeProfile", element: <>
        <div className=""><>
          {isMobile ? <EditProfileMobile /> : ""}
        </></div>
      </>, withBottomNav: true
    },
    {
      path: "/settings", element: <>
        <div className=""><>
          {isMobile ? <SettingsPage /> : ""}
        </></div>
      </>, withBottomNav: true
    },
    {
      path: "/sawrenmen", element: <>
        <div className=""><>{isMobile ? <LikedSongsPage /> : ""}</></div>
      </>, withBottomNav: true
    },
    {
      path: "/auth", element: <>
        <div className=""><>{isMobile ? <Register /> : ""}</></div>
      </>, withBottomNav: true
    },
    {
      path: "/confirm", element: <>
        <div className=""><>{isMobile ? <ConfirmEmail /> : <ConfirmEmail />}</></div>
      </>, withBottomNav: true
    },

    {
      path: "/playlist/:id", element: <>
        <div className=""><>{isMobile ? <PlaylistDetailPage /> : ""}</></div>
      </>, withBottomNav: true
    },
    {
      path: "/telechaje", element: <>
        <div className=""><>{isMobile ? <OfflineMusic /> : ""}</></div>
      </>, withBottomNav: true
    },
    {
      path: "/nouvoson", element: <>
        <div className=""><>{isMobile ? <AddMusicMobile /> : ""}</></div>
      </>, withBottomNav: true
    },
    {
      path: "/album", element: <>
        <div className=""><>{isMobile ? <AlbumDetailPage /> : ""}</></div>
      </>, withBottomNav: true
    },

    { path: "/devniAtis", element: <BecomeArtist />, withBottomNav: true },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, element, withBottomNav }) => (
          <Route
            key={path}
            path={path}
            element={
              <div className={`${withBottomNav ? " pb-20" : ""}`}>
                {}
                {!isOnline && isMobile && path !== "/" ? (
                  <OfflineMusic isRedirected={true} />
                ) : (
                  React.cloneElement(element)
                )}
              </div>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;