# iCloud Keychain Integration Setup

This document explains how to complete the setup for iCloud Keychain integration
for the WhichCraft mobile app.

## Prerequisites

1. Apple Developer Account with access to your app's Team ID
2. Access to your web server to add the required Apple App Site Association file

## Steps to Complete Setup

### 1. Find Your Team ID

Your Team ID can be found in your Apple Developer account:

1. Go to https://developer.apple.com/account/
2. Click on "Membership" in the sidebar
3. Look for "Team ID" in the membership information section

### 2. Create Apple App Site Association File

Create a file named `apple-app-site-association` (no file extension) with the
following content:

```json
{
  "webcredentials": {
    "apps": ["YOUR_TEAM_ID.com.ericcecchi.whichcraft"]
  },
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "YOUR_TEAM_ID.com.ericcecchi.whichcraft",
        "paths": ["*"]
      }
    ]
  }
}
```

Replace `YOUR_TEAM_ID` with your actual Team ID from step 1.

### 3. Host the File on Your Website

The file must be hosted at:

```
https://whichcraft.ericcecchi.com/.well-known/apple-app-site-association
```

Make sure to:

- Place the file in a directory named `.well-known` at the root of your domain
- Ensure the file is served with the `Content-Type: application/json` header
- Ensure the file is accessible via HTTPS

For Vercel deployment, create a `public/.well-known` directory in your Next.js
project and place the file there.

### 4. Enable Associated Domains in Apple Developer Portal

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Select your app's identifier
3. Check the "Associated Domains" capability
4. Save the changes

### 5. Build and Submit the App

Use EAS Build to create a new build with the updated configuration:

```bash
eas build --platform ios
```

## Testing the Integration

After setting up:

1. Sign in to your website on Safari
2. Install the app on your device
3. When you open the sign-in screen, you should see an option to use your saved
   password from the website

## Troubleshooting

- Use Apple's
  [Associated Domains Validation Tool](https://search.developer.apple.com/appsearch-validation-tool/)
  to verify your setup
- Check that the Team ID exactly matches your Apple Developer account
- Ensure your bundle identifier in app.json matches what's in the Apple
  Developer Portal
