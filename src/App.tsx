import React, { useState, useEffect } from "react"; // Nou ajoute useState ak useEffect
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css"
import Home from "./components/Home/Home";
import PlayList from "./components/playList/PlayList";
import { isMobile } from 'react-device-detect';
import HomeMobile from "./components/Mobile/Home/Home";
import PlaylistPage from "./components/Mobile/PlayListe/PlayList";
import ArtistPageMobile from "./components/Mobile/artistPage/ArtistPageMobile";
import ArtistePage from "./components/Artiste/ArtistePage";
import UserProfile from "./components/Mobile/userProfileMobile/UserProfileMobile";
import UserProfilePC from "./components/userprofilePc/UserProfilePc";
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

function App() {
  // 1. Nou kreye yon eta pou detekte si moun lan online
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

  const routes = [
    {
      path: "/", 
      element: (
        <>
          {/* 2. Si li offline, nou montre OfflineMusic dirèkteman sou "/" */}
          {!isOnline && isMobile ? (
            <OfflineMusic isRedirected={true} />
          ) : (
            !isMobile ? <Home /> : <HomeMobile />
          )}
        </>
      ), 
      withBottomNav: true 
    },

    { path: "/playlist", element: <PlayList />, withBottomNav: true },
    {
      path: "/artist", element:
        <>
          {isMobile ? <ArtistPageMobile /> : <ArtistePage />}
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
          {isMobile ? <UserProfile /> : <UserProfilePC />}
        </></div>
      </>, withBottomNav: true
    },
    {
      path: "/editeProfile", element: <>
        <div className=""><>
          {isMobile ? <EditProfileMobile /> : <UserProfilePC />}
        </></div>
      </>, withBottomNav: true
    },
    {
      path: "/settings", element: <>
        <div className=""><>
          {isMobile ? <SettingsPage /> : <UserProfilePC />}
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
                {/* 3. Si li offline epi l ap eseye ale nan yon lòt paj ki pa "/", nou ka fòse l wè OfflineMusic tou */}
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