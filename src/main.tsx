import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { AudioProvider } from './provider/PlayerContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { ProfileProvider } from './context/ProfileContext.tsx'
import { TrackProvider } from './context/TrackContext.tsx'
import { LikeProvider } from './context/LikeContext.tsx'
import { PlaylistProvider } from './context/PlaylistContext.tsx'
import { registerSW } from 'virtual:pwa-register'
import { AlbumProvider } from './context/AlbumContext.tsx'
import { DownloadProvider } from './context/DownloadContext.tsx'
import { SearchProvider } from './context/SearchContext.tsx'
import { FollowProvider } from './context/FollowContext.tsx'
import { RecommendationProvider } from './context/RecommendationProvider.tsx'

const updateSW = registerSW({
  immediate: true, 
  onNeedRefresh() {
    if (confirm('Nouvo vèsyon disponib. Rafrechi?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Aplikasyon an prè pou mache offline!')
  },
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ProfileProvider> 
          <FollowProvider> 
            <RecommendationProvider>
              <TrackProvider>
                <AlbumProvider>
                  <PlaylistProvider>
                    <LikeProvider>
                      <DownloadProvider>
                        <SearchProvider>
                          <AudioProvider> 
                            <App />
                          </AudioProvider>
                        </SearchProvider>
                      </DownloadProvider>
                    </LikeProvider>
                  </PlaylistProvider>
                </AlbumProvider>
              </TrackProvider>
            </RecommendationProvider>
          </FollowProvider>
        </ProfileProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)