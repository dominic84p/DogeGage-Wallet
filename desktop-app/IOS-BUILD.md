# Building for iOS (Warning: This Will Make You Insane)

iOS builds are intentionally painful because Apple. Here's how to do it anyway.

## Prerequisites

- macOS with Xcode installed (not just Command Line Tools)
- An Apple ID (free account works, no $99/year needed)
- Patience and/or a therapist

## Setup (One Time)

1. Open Xcode
2. Go to Xcode > Settings > Accounts
3. Click the "+" button and add your Apple ID
4. Select your account and click "Manage Certificates"
5. Click "+" and create an "Apple Development" certificate

## Get Your Team ID

```bash
cd desktop-app
bun run tauri info
```

Look for "iOS > Developer Teams" in the output. Copy your Team ID.

## Add Team ID to Config

Edit `desktop-app/src-tauri/tauri.conf.json`:

```json
{
  "bundle": {
    "iOS": {
      "developmentTeam": "YOUR_TEAM_ID_HERE"
    }
  }
}
```

## Build

```bash
cd desktop-app
bun install
bun run tauri ios init  # First time only
bun run tauri ios build
```

## Find Your IPA

The IPA will be somewhere in `src-tauri/gen/apple/build/` - good luck finding it because Xcode loves hiding things.

Or just look for `*.ipa` files:

```bash
find src-tauri -name "*.ipa"
```

## Install on Your Device

Use one of these tools to sideload:
- AltStore
- Sideloadly
- TrollStore (if you're on a compatible iOS version)

## Important Notes

- Apps signed with a free Apple ID expire after 7 days
- You'll need to re-sign and reinstall weekly
- This is why most people just use the web version
- Seriously, the web version works great
- But if you insist on native iOS, here you go

## Troubleshooting

**Build fails with "requires a development team"**
- You forgot to add your Team ID to tauri.conf.json

**Build hangs forever**
- Welcome to Xcode. Cancel it (Ctrl+C) and try again
- Or restart your Mac
- Or sacrifice a keyboard to the Apple gods

**"No provisioning profile found"**
- Open the Xcode project and let it auto-generate one:
  ```bash
  open src-tauri/gen/apple/desktop-app.xcodeproj
  ```
- Select your team in the Signing & Capabilities tab

**Still not working?**
- Just use the web version at https://wallet.dogegage.xyz
- Add it to your home screen
- It's literally the same thing
- Save yourself the pain

## Why Is This So Hard?

Because Apple wants you to pay $99/year for a developer account. This is their way of making free development "possible" but annoying enough that you'll eventually pay up.

Good luck! 🫡
