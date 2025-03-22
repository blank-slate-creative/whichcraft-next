# iCloud Keychain Integration in WhichCraft

This document explains the iCloud Keychain integration that has been implemented
in the WhichCraft mobile app.

## Implementation Details

### 1. TextInput Configuration

We've added specific props to the TextInput components for both the sign-in and
sign-up screens:

#### Sign-In Screen

- Email field: `textContentType="emailAddress"` and `autoComplete="email"`
- Password field: `textContentType="password"` and `autoComplete="password"`

#### Sign-Up Screen

- Email field: Same as sign-in
- Password fields: `textContentType="newPassword"` and
  `autoComplete="new-password"`

These properties enable:

- Password suggestion functionality on iOS
- Seamless password autofill
- Ability for users to generate and save strong passwords via iCloud Keychain

### 2. Associated Domains Configuration

We've configured the app to work with Associated Domains to link the app with
our website:

```json
// In app.json
"associatedDomains": [
  "webcredentials:whichcraft.ericcecchi.com",
  "applinks:whichcraft.ericcecchi.com"
]
```

This allows passwords saved on the website to be available in the mobile app and
vice versa. The applinks entry also enables Universal Links for seamless app-web
navigation.

### 3. Website Configuration

To complete the integration, we've created an Apple App Site Association file
that needs to be hosted on our website at
`https://whichcraft.ericcecchi.com/.well-known/apple-app-site-association`.

## Testing

When testing on a physical device (not a simulator), you should see:

- Password autofill options appearing in the keyboard area
- The ability to generate and save strong passwords
- Saved passwords from Safari/iCloud Keychain becoming available in the app

## Important Notes

1. This functionality only works on iOS devices, not in simulators
2. The website integration requires the Apple App Site Association file to be
   properly hosted
3. The full shared credentials between web and app will only work once the app
   is built and deployed with the proper configuration

## Resources

- [Apple Password AutoFill Documentation](https://developer.apple.com/documentation/security/password_autofill/)
- [Associated Domains Documentation](https://developer.apple.com/documentation/xcode/supporting-associated-domains)
- [How to test the integration](https://developer.apple.com/videos/play/wwdc2017/206/)
