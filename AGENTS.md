<!-- @AGENTS.md -->
@CLAUDE.md

Guidance for Claude (and Claude Code) when working in this repository.

## Project Overview

**SafeWalk** is a non-profit college project: an Android personal-safety app. A user starts a "walk," shares live location, and can trigger emergency alerts to a linked contact. No backend server — everything is local-first and device-to-device.

Full context: see `SafeWalk_App_Brief.md` (product rationale) and `README.md` (setup).

## Core Features (build in this order)

1. **Track You Live** — live location on a map during an active walk
2. **Emergency SOS** — one-tap manual button, alerts the emergency contact
3. **Share Route** — emergency contact views the active walk inside the app (no external links)
4. **Expected Arrival** — set destination + ETA; auto-notify contact if overdue
5. **Emergency Contact** — link one trusted contact to receive alerts

**Explicitly out of scope:** automatic/passive alert triggers (no-movement, route-deviation detection). Don't add these unless the user asks — it was a deliberate scope cut, not an oversight.

## Tech Stack & Constraints

- **Platform:** Android only (no iOS)
- **Language:** Kotlin (Android Studio project)
- **Location:** Android GeoLocation / FusedLocationProvider API
- **Maps:** Google Maps SDK for Android
- **Alerts:** Local Notification service, device-to-device — **no server, no cloud database**
- **Storage:** On-device only (Room/SharedPreferences). Never introduce a remote database or add data upload/sync without explicit user approval — this is a stated privacy requirement, not a default to optimize away.

## Working Conventions

- This is a **student project in active early development** — prefer simple, readable implementations over clever/optimized ones. Clarity > cleverness.
- Follow the phased build order above. Don't jump ahead to Phase 3/4 features while Phase 1/2 are incomplete unless asked.
- Since there's no server, testing SOS/alert flows requires **two devices/emulators** (walker + contact). Mention this when writing test instructions.
- Keep the Maps API key out of version control — read from `local.properties`, never hardcode.
- When adding a feature, check it against the feature table in `SafeWalk_App_Brief.md` first — if it's not listed or explicitly deferred, flag it to the user rather than assuming it should be built.

## Commands

```bash
# Build
./gradlew build

# Run unit tests
./gradlew test

# Install debug build on a connected device/emulator
./gradlew installDebug
```

(Update this section once the project's actual module structure and test setup are in place.)

## Things to Avoid

- Don't add a backend/server or cloud storage — data is local-only by design.
- Don't add automatic passive-alert triggers — out of scope by decision.
- Don't add iOS-specific code or dependencies.
- Don't switch Share Route to an external shareable link — it's meant to be in-app only.
