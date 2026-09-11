# SafeWalk

**SafeWalk** is a non-profit college Android project designed to improve personal safety while walking.

The app allows a user to start a walk, track their live location, share their active route with a trusted emergency contact, and trigger an emergency SOS alert when needed.

SafeWalk follows a **local-first, privacy-focused design**. It does not use a backend server or cloud database.

---

## Project Overview

SafeWalk is built around a simple idea:

> **Let someone you trust know where you are while you walk, and give you a fast way to call for help if something goes wrong.**

The application is designed for two participants:

- **Walker** — the person currently taking a walk.
- **Emergency Contact** — the trusted person who can receive alerts and view the active walk.

Because there is no central backend, device-to-device functionality is designed around direct communication between the two devices.

---

## Core Features

Features are developed in the following order:

### 1. Track You Live

- Start an active walk.
- Track the user's current location.
- Display the location on a map.
- Continue tracking while the walk is active.

### 2. Emergency SOS

- Provide a prominent one-tap SOS button.
- Allow the walker to manually trigger an emergency alert.
- Notify the linked emergency contact.

### 3. Share Route

- Allow the emergency contact to view the active walk.
- Display the walker's current location/route inside the SafeWalk app.
- Keep route sharing inside the application.

### 4. Expected Arrival

- Allow the walker to set a destination.
- Allow the walker to specify an expected arrival time.
- Automatically notify the emergency contact if the walker becomes overdue.

### 5. Emergency Contact

- Allow the user to link one trusted emergency contact.
- Use this contact for emergency notifications and active-walk sharing.

---

## Out of Scope

The following features are intentionally **not included** in the project:

- Automatic/passive emergency detection
- No-movement detection
- Route-deviation detection
- Other automatic passive-alert triggers
- External shareable route links
- iOS support
- Backend infrastructure
- Cloud database
- Automatic cloud synchronization

These should not be implemented unless the project requirements are explicitly changed.

---

## Technology Stack

| Component | Technology |
|---|---|
| Platform | Android |
| Programming Language | Kotlin |
| Development Environment | Android Studio |
| Location | Android Geolocation / Fused Location Provider |
| Maps | Google Maps SDK for Android |
| Alerts | Local notification service / device-to-device communication |
| Storage | Room and/or SharedPreferences |
| Backend | None |
| Cloud Database | None |

---

## Privacy & Data Storage

SafeWalk is designed to keep user data **local to the device**.

### Data Principles

- User data should be stored on-device.
- No backend server should be introduced.
- No cloud database should be introduced.
- No unnecessary data should be uploaded.
- Data synchronization should not be added without explicit approval.

This local-first approach is a deliberate privacy and architectural requirement.

---

## Google Maps API Key

The Google Maps API key must **never be hardcoded** into the source code.

Use:

```text
local.properties
```

for local API-key configuration.

### Example

```properties
MAPS_API_KEY=your_api_key_here
```

The actual API key must not be committed to Git.

Make sure `local.properties` is included in `.gitignore`.

---

## Development Approach

SafeWalk is a student project in early development.

The project prioritizes:

- Simple code
- Readability
- Correctness
- Maintainability
- Clear architecture

Avoid unnecessary optimization or complex abstractions.

### Development Order

```text
Phase 1
Track You Live
      |
      v
Phase 2
Emergency SOS
      |
      v
Phase 3
Share Route
      |
      v
Phase 4
Expected Arrival
      |
      v
Phase 5
Emergency Contact
```

Later features should not be prioritized over incomplete earlier features unless explicitly requested.

---

## Testing

SafeWalk's device-to-device functionality requires **two devices or emulators** for proper testing.

### Walker Device

The device used by the person taking the walk.

### Emergency Contact Device

The device used by the trusted contact receiving emergency information.

For example, an SOS test should verify:

```text
Walker Device
     |
     | Trigger SOS
     v
SafeWalk
     |
     | Emergency notification
     v
Contact Device
```

Testing only one device is insufficient for validating the complete device-to-device alert flow.

---

## Build & Run

Clone the repository and open the project in Android Studio.

Then build the project with:

```bash
./gradlew build
```

Run unit tests:

```bash
./gradlew test
```

Install the debug build on a connected Android device or emulator:

```bash
./gradlew installDebug
```

> These commands may need to be updated if the project's Gradle module structure or test configuration changes.

---

## Project Documentation

The main product requirements and rationale are documented in:

```text
SafeWalk_App_Brief.md
```

Check this document before implementing new functionality.

If a feature is not included in the project requirements or has been explicitly deferred, do not assume that it should be implemented.

---

## Development Rules

When contributing to SafeWalk:

1. Follow the defined feature development order.
2. Keep implementations simple and readable.
3. Keep user data local.
4. Do not introduce a backend server.
5. Do not introduce a cloud database.
6. Do not add automatic passive-alert detection.
7. Do not add iOS-specific functionality.
8. Keep route sharing inside the SafeWalk application.
9. Never commit API keys or other secrets.
10. Check `SafeWalk_App_Brief.md` before adding new features.

---

## Things to Avoid

Do **not** add:

```text
Backend Server
Cloud Database
Cloud Storage
Automatic Passive Alerts
No-Movement Detection
Route-Deviation Detection
iOS Dependencies
External Route-Sharing Links
Hardcoded API Keys
```

These restrictions are part of the project's intended scope.

---

## Project Goal

The goal of SafeWalk is to provide a **simple, privacy-focused Android safety application** that allows users to:

- Track their location during a walk.
- Stay connected to a trusted emergency contact.
- Quickly trigger an SOS alert.
- Share their active route within the app.
- Set an expected arrival time.
- Receive support from a trusted contact without relying on a central backend.

---

## Project Status

**Status:** Early Development

### Planned Feature Progression

- [ ] Track You Live
- [ ] Emergency SOS
- [ ] Share Route
- [ ] Expected Arrival
- [ ] Emergency Contact

---

## License

This project is a **non-profit college project** developed for educational purposes.