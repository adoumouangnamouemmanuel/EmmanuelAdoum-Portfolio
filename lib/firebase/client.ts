import { getApps, initializeApp } from 'firebase/app';
import { fetchAndActivate, getRemoteConfig } from 'firebase/remote-config';

const firebaseConfig = {
  // your config here
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Remote Config with error handling
try {
  const remoteConfig = getRemoteConfig(app);
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
  
  // Fetch and activate config
  fetchAndActivate(remoteConfig)
    .catch(error => {
      console.warn('Remote Config fetch failed:', error);
    });
} catch (error) {
  console.warn('Remote Config initialization failed:', error);
}

export { app };
