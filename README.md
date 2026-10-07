# SafeWalk

SafeWalk is a React Native mobile application developed with Expo. The app is designed to help users feel safer when walking alone by providing live location tracking, emergency SOS support, trusted contacts, destination selection, and walk history.

## Project Overview

SafeWalk allows users to:

- Create an account and log in
- Start a walk
- Select a destination
- Track their live location
- View their location on a map
- Use an SOS emergency feature
- Add and delete emergency contacts
- View previous walks
- Manage their account

The application uses Firebase for authentication and Firestore for storing application data. AsyncStorage is used for local session persistence.

## Main Features

### Authentication

- User Sign Up
- User Login
- Google Sign-In
- Apple Sign-In
- Firebase Authentication
- Persistent login session

### Walk

- Start a walk
- Select a destination
- Track live location
- Display the walk on a map
- Calculate walking distance
- Finish a walk
- Save walk information to Firestore

### Live Location

- Display the user's current location
- Track location while walking
- Update the location on the map
- Use location services for walk tracking

### SOS Emergency

- One-tap SOS feature
- Display live location during SOS
- Show the user's current location on a map
- Access emergency contacts
- Stop the SOS session

### Emergency Contacts

- View emergency contacts
- Add emergency contacts
- Delete emergency contacts
- Store contact information for emergency use

### Walk History

- View previous walks
- View saved walk information
- Retrieve walk data from Firebase Firestore

### Account

- View account information
- Manage account settings
- Logout

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

# How to Run the Project

## Requirements

Before running SafeWalk, make sure you have:

- Node.js installed
- npm installed
- Git installed
- Expo Go installed for physical-device testing
- Android Studio for Android emulator testing
- Xcode for iOS development on macOS

---

## 1. Clone the Repository

Open PowerShell or Command Prompt and run:

```bash
git clone https://github.com/aaryagoriya/SafeWalk.git
```

Go into the project folder:

```bash
cd SafeWalk
```

---

## 2. Install Dependencies

Run:

```bash
npm install
```

This installs all packages required by the project.

---

## 3. Start the Expo Project

Run:

```bash
npx expo start
```

You can also use:

```bash
npm start
```

This starts the Expo development server and displays the QR code and development options.

---

## 4. Run on a Physical Device

The easiest way to test SafeWalk is using Expo Go.

### Steps

1. Install **Expo Go** on your phone.
2. Connect your phone and computer to the same Wi-Fi network.
3. Start the project:

```bash
npx expo start
```

4. Scan the QR code using Expo Go.
5. Allow location permissions when requested.

A physical device is recommended for testing location and SOS features.

---

## 5. Run on Android

Run:

```bash
npm run android
```

This starts the application on an Android emulator or connected Android device.

---

## 6. Run on iOS

Run:

```bash
npm run ios
```

This requires macOS and the required iOS development tools.

---

## 7. Run on Web

Run:

```bash
npm run web
```

The web version can be used for basic interface testing.

Mobile-specific features such as location tracking should be tested on a mobile device.

---

# Firebase Setup

SafeWalk uses Firebase for:

- Firebase Authentication
- Firebase Firestore

The Firebase configuration is located in:

```text
FirebaseConfig.js
```

Firebase is used to manage user authentication and application data.

If you want to connect the application to another Firebase project, update the Firebase configuration with the settings from your Firebase project.

### Firebase Authentication

The application supports:

- Email/Password authentication
- Google authentication
- Apple authentication

Make sure the required authentication providers are enabled in your Firebase project.

### Firestore

Firestore is used to store application data such as:

- User information
- Emergency contacts
- Walk information
- Walk history

---

# Location Setup

SafeWalk uses:

```text
Expo Location
```

Location permissions are required for:

- Live location tracking
- Walk tracking
- Live maps
- SOS location

When testing the application, allow location permission when requested.

For the best results, test location features on a physical mobile device.

---

# Technologies Used

## Frontend

- React Native
- Expo
- JavaScript
- Expo Router
- React Navigation

## Backend / Database

- Firebase Authentication
- Firebase Firestore

## Local Storage

- AsyncStorage

## Maps and Location

- React Native Maps
- Expo Location

## Authentication

- Google Sign-In
- Apple Authentication
- Expo Auth Session

## Other Libraries

- Expo Vector Icons
- React Native Reanimated
- React Native Gesture Handler
- React Native Safe Area Context
- Expo Haptics
- Expo Web Browser
- Expo Constants
- Expo Crypto

---

# Project Structure

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
├── assets/
│   └── Images, icons and other assets
│
├── components/
│   └── Reusable components
│
├── constants/
│   └── Application constants
│
├── hooks/
│   └── Custom React hooks
│
├── scripts/
│   └── Project scripts
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

# Application Screens

## Landing Screen

The landing screen is the starting point of the application.

Users can continue to the login or sign-up screens.

## Login Screen

Allows existing users to log in to SafeWalk.

## Sign Up Screen

Allows new users to create a SafeWalk account.

## Home Screen

The main screen after the user logs in.

It provides access to the main SafeWalk features.

## Walk Screen

Allows users to:

- Start a walk
- Select a destination
- View their current location
- Track their movement
- Finish their walk

## Live Map

Displays the user's current location on a map.

The live map is also used during the SOS flow.

## SOS Screen

Provides access to the emergency SOS functionality.

## Contact Screen

Allows users to manage their emergency contacts.

Users can add or delete contacts.

## Add Contact Screen

Allows users to add a new emergency contact.

## Walk History

Displays previously completed walks.

## Account Screen

Provides account-related options and logout functionality.

---

# Useful Commands

### Start Expo

```bash
npm start
```

### Start Expo Directly

```bash
npx expo start
```

### Run Android

```bash
npm run android
```

### Run iOS

```bash
npm run ios
```

### Run Web

```bash
npm run web
```

### Run ESLint

```bash
npm run lint
```

### Install Dependencies

```bash
npm install
```

---

# Troubleshooting

## Expo is not starting

Try:

```bash
npm install
```

Then:

```bash
npx expo start
```

---

## Location is not working

Check that:

- Location permission is enabled.
- Location services are enabled on the device.
- The application is running on a supported device or emulator.
- The device has an active location signal.

---

## Firebase is not working

Check that:

- Firebase is configured correctly.
- Firebase Authentication is enabled.
- Required authentication providers are enabled.
- Firestore is configured correctly.
- `FirebaseConfig.js` contains the correct Firebase configuration.

---

## Changes are not appearing

Stop the Expo development server:

```text
CTRL + C
```

Then start it again:

```bash
npx expo start
```

---

# Development Notes

- Run `npm install` after cloning the repository.
- Keep Firebase configuration available for authentication and Firestore.
- Allow location permissions when testing location features.
- Use a physical device when testing live location and SOS functionality.
- Keep the computer and mobile device connected to the same network when using Expo Go.
