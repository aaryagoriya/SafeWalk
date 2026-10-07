# SafeWalk

SafeWalk is a React Native mobile app built with Expo. It helps users feel safer when walking alone by providing live location tracking, an emergency SOS feature, trusted emergency contacts, destination selection and walk history.

---

## Table of Contents

- [Features](#features)
- [User Flow](#user-flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the App](#running-the-app)
- [Firebase Setup](#firebase-setup)
- [Location Setup](#location-setup)
- [Available Scripts](#available-scripts)
- [App Screens](#app-screens)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)

---

## Features

### Authentication
- Sign up and log in with email and password
- Google Sign-In
- Apple Sign-In
- Persistent login session (AsyncStorage)

### Walks
- Start a walk and select a destination
- Track live location and view the walk on a map
- Calculate walking distance
- Finish a walk and save it to Firestore

### SOS Emergency
- One-tap SOS
- Live location shown on a map during SOS
- Access to emergency contacts
- Stop the SOS session

### Emergency Contacts
- View, add and delete emergency contacts

### Walk History
- View previously completed walks, loaded from Firestore

### Account
- View account information and settings
- Log out

---

## User Flow

```text
Landing
   |
Login / Sign Up
   |
  Home
   |
   +---- Start Walk
   |       |
   |   Select Destination
   |       |
   |    Start Walk
   |       |
   |   Live Location
   |       |
   |    Finish Walk
   |
   +---- Past Walks
   |
   +---- Contacts
   |       |
   |    Add Contact
   |       |
   |    Delete Contact
   |
   +---- Account
   |       |
   |     Logout
   |
   +---- SOS
           |
        Live Map
           |
        Stop SOS
```

---

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React Native 0.81, React 19.1, Expo SDK 54, JavaScript, Expo Router, React Navigation |
| Backend / Database | Firebase Authentication, Firebase Firestore |
| Local storage | AsyncStorage |
| Maps and location | React Native Maps, Expo Location |
| Authentication | Google Sign-In, Apple Authentication, Expo Auth Session |
| Other libraries | Expo Vector Icons, React Native Reanimated, React Native Gesture Handler, React Native Safe Area Context, Expo Haptics, Expo Web Browser, Expo Constants, Expo Crypto |

---

## Project Structure

```text
SafeWalk/
│
├── app/
│   ├── AddContact.js
│   ├── Index.js
│   ├── Landing.js
│   ├── LiveMap.js
│   ├── Login.js
│   ├── SignUp.js
│   ├── Walk.js
│   ├── WalkHistory.js
│   ├── _layout.js
│   │
│   └── Tabs/
│       ├── Account.js
│       ├── Contact.js
│       ├── Home.js
│       ├── SOS.js
│       └── _layout.js
│
├── assets/          # Images, icons and other assets
├── components/      # Reusable components
├── constants/       # Application constants
├── hooks/           # Custom React hooks
├── scripts/         # Project scripts
│
├── FirebaseConfig.js
├── app.json
├── eas.json
├── eslint.config.js
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- **Expo Go** on your phone (for physical-device testing)
- Android Studio (optional, for the Android emulator)
- Xcode on macOS (optional, for iOS development)

### 1. Clone the repository

```bash
git clone https://github.com/aaryagoriya/SafeWalk.git
cd SafeWalk
```

### 2. Install dependencies

Run this from the project root (the `SafeWalk` folder):

```bash
npm install
```

This installs every package listed in `package.json`, so it is the only command most people need.

<details>
<summary><b>Optional: install each dependency manually</b></summary>

You do **not** need these if `npm install` worked. They are only useful if you are rebuilding the project from scratch. Run them from the project root.

**Core and Expo packages**

```bash
npx expo install expo expo-router react react-dom react-native expo-apple-authentication expo-auth-session expo-constants expo-crypto expo-font expo-haptics expo-image expo-linking expo-location expo-splash-screen expo-status-bar expo-symbols expo-system-ui expo-web-browser @expo/vector-icons
```

**React Native packages**

```bash
npx expo install @react-native-async-storage/async-storage react-native-gesture-handler react-native-maps react-native-reanimated react-native-safe-area-context react-native-screens react-native-web react-native-worklets
```

**Firebase, Google Sign-In and React Navigation**

```bash
npm install firebase @react-native-google-signin/google-signin @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/elements
```

**Development dependencies**

```bash
npm install --save-dev eslint eslint-config-expo typescript @types/react
```

</details>

### 3. Start the Expo development server

```bash
npx expo start
```

You can also use `npm start`. The terminal will show a QR code and development options.

---

## Running the App

### On a physical device (recommended)

1. Install **Expo Go** on your phone.
2. Connect your phone and computer to the **same Wi-Fi network**.
3. Run `npx expo start` in the project root.
4. Scan the QR code with Expo Go.
5. Allow location permissions when asked.

A physical device is recommended for testing location tracking and SOS.

> **Note:** SafeWalk uses native modules such as `@react-native-google-signin/google-signin`. Native modules like this may not work inside Expo Go. If Google Sign-In fails in Expo Go, run the app as a development build using the Android or iOS commands below.

### On Android

```bash
npm run android
```

This runs `expo run:android`, which builds the app and installs it on an Android emulator or a connected Android device. It requires Android Studio and the Android SDK to be set up.

### On iOS

```bash
npm run ios
```

This runs `expo run:ios`, which requires macOS and Xcode.

### On web

```bash
npm run web
```

The web version is only suitable for basic interface testing. Mobile-specific features such as location tracking should be tested on a mobile device.

---

## Firebase Setup

SafeWalk uses Firebase Authentication and Firestore. The Firebase configuration is in:

```text
FirebaseConfig.js
```

To connect the app to your own Firebase project:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable the authentication providers you want to use (Email/Password, Google, Apple).
3. Create a Firestore database.
4. Replace the settings in `FirebaseConfig.js` with the configuration from your Firebase project.

Firestore stores:
- User information
- Emergency contacts
- Walk information
- Walk history

---

## Location Setup

SafeWalk uses **Expo Location**. Location permission is required for:

- Live location tracking
- Walk tracking
- Live maps
- SOS location

Allow location permission when prompted. For best results, test on a physical mobile device.

---

## Available Scripts

Run these from the project root.

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm start` | Start the Expo development server (`expo start`) |
| `npx expo start` | Start the Expo development server directly |
| `npm run android` | Build and run on Android (`expo run:android`) |
| `npm run ios` | Build and run on iOS (`expo run:ios`) |
| `npm run web` | Start the web version (`expo start --web`) |
| `npm run lint` | Run ESLint (`expo lint`) |
| `npm run reset-project` | Run `scripts/reset-project.js` (see warning below) |

> **Warning:** `npm run reset-project` comes from the Expo starter template and may move or delete the starter code in your project. Do not run it unless you know what it does.

---

## App Screens

| Screen | File | Purpose |
| --- | --- | --- |
| Landing | `app/Landing.js` | Starting point; continue to login or sign up |
| Login | `app/Login.js` | Log in to an existing account |
| Sign Up | `app/SignUp.js` | Create a new account |
| Home | `app/Tabs/Home.js` | Main screen after login |
| Walk | `app/Walk.js` | Start a walk, pick a destination, track and finish |
| Live Map | `app/LiveMap.js` | Shows current location; also used in the SOS flow |
| SOS | `app/Tabs/SOS.js` | Emergency SOS feature |
| Contacts | `app/Tabs/Contact.js` | View and delete emergency contacts |
| Add Contact | `app/AddContact.js` | Add a new emergency contact |
| Walk History | `app/WalkHistory.js` | View previous walks |
| Account | `app/Tabs/Account.js` | Account options and logout |

---

## Troubleshooting

**Expo is not starting**

```bash
npm install
npx expo start
```

**Location is not working**

- Check that location permission is enabled for the app.
- Check that location services are turned on for the device.
- Make sure you are using a supported device or emulator.
- Make sure the device has an active location signal.

**Firebase is not working**

- Check that `FirebaseConfig.js` contains the correct configuration.
- Check that Firebase Authentication and the required sign-in providers are enabled.
- Check that Firestore is set up in your Firebase project.

**Changes are not appearing**

Stop the development server with `CTRL + C`, then start it again:

```bash
npx expo start
```

---

## Development Notes

- Run `npm install` after cloning the repository.
- Keep your Firebase configuration available for authentication and Firestore.
- Allow location permissions when testing location features.
- Use a physical device to test live location and SOS.
- Keep your computer and phone on the same network when using Expo Go.
