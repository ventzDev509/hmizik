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

const updateSW = registerSW({
  immediate: true, // Sa a enpòtan pou l detekte PWA a vit
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
        
          <TrackProvider> 
            <LikeProvider>
              <PlaylistProvider>
                <AudioProvider>
                  
                  <App />
                </AudioProvider>
              </PlaylistProvider>
            </LikeProvider>
          </TrackProvider>
        </ProfileProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)