---
title: "Expo + React Native: Google ile Giriş Rehberi (Android + iOS)"
description: "Expo projesinde Google login akışını Android ve iOS için kısa, net ve üretime uygun şekilde kurma rehberi."
date: "2026-02-07"
tags: ["expo", "react-native", "google-signin", "android", "ios", "oauth", "authentication"]
---

# Expo + React Native: Google ile Giriş Rehberi (Android + iOS)

Bu rehber, `@ademhatay/expo-google-signin` ile Google girişini hızlıca kurmak içindir.

Hedef:
- Android ve iOS'ta tek API ile giriş
- Kullanıcıyı local'de saklama
- Backend'de `idToken` doğrulama

## 1) Paket Kurulumu

> Bu paket Expo Go'da çalışmaz. Development build gerekir.

```bash
npm install @ademhatay/expo-google-signin
# veya
bun add @ademhatay/expo-google-signin
```

```bash
npx expo run:android
npx expo run:ios
```

## 2) Google Cloud Console Ayarları

Gerekli sayfalar:
- https://console.cloud.google.com/
- https://console.cloud.google.com/apis/credentials
- https://console.cloud.google.com/apis/credentials/consent

### 2.1 Web OAuth Client (zorunlu)

- Tür: `Web application`
- Bu ID, uygulamada `serverClientId` olarak kullanılacak.

Kural:
- `serverClientId` her zaman **Web Client ID** olmalı.

### 2.2 Android OAuth Client

- Tür: `Android`
- Package name ve SHA-1 doğru olmalı.

SHA-1 alma:

```bash
cd android
./gradlew signingReport
```

Release sürecinde birden fazla SHA-1 olabilir (upload key, Play signing key). Gerekli olanları Console'a ekleyin.

### 2.3 iOS OAuth Client

- Tür: `iOS`
- Bundle Identifier, uygulamadaki bundle ID ile aynı olmalı.

### 2.4 OAuth Consent Screen

- Uygulama `Testing` modundaysa test kullanıcılarını ekleyin.

## 3) Expo Plugin Ayarı (iOS)

`app.json` veya `app.config.ts`:

```json
{
  "expo": {
    "plugins": [
      [
        "@ademhatay/expo-google-signin",
        {
          "iosClientId": "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com"
        }
      ]
    ]
  }
}
```

## 4) Ortam Değişkenleri

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=YOUR_IOS_CLIENT_ID.apps.googleusercontent.com
```

## 5) Servis Katmanı

### 5.1 `auth-storage.ts`

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PersistedGoogleUser = {
  id: string;
  idToken: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;
  profilePictureUrl?: string;
  phoneNumber?: string;
};

const KEY = 'auth:google-user:v1';

export async function saveUser(user: PersistedGoogleUser | null) {
  if (!user) {
    await AsyncStorage.removeItem(KEY);
    return;
  }
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
}

export async function loadUser(): Promise<PersistedGoogleUser | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedGoogleUser;
  } catch {
    return null;
  }
}
```

### 5.2 `auth-service.ts`

```ts
import { Platform } from 'react-native';
import { signIn, signOut, GoogleUser } from '@ademhatay/expo-google-signin';
import { saveUser, loadUser } from './auth-storage';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

if (!WEB_CLIENT_ID) {
  throw new Error('Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
}

function getIosClientId() {
  if (Platform.OS !== 'ios') return undefined;
  return IOS_CLIENT_ID;
}

export async function loginWithGoogle(options?: { androidButtonFlow?: boolean }) {
  const user = await signIn({
    serverClientId: WEB_CLIENT_ID,
    iosClientId: getIosClientId(),
    filterByAuthorizedAccounts: false,
    signInButtonFlow: options?.androidButtonFlow ?? false
  });

  await saveUser(user);
  return user;
}

export async function logoutGoogle() {
  await signOut();
  await saveUser(null);
}

export async function restorePersistedUser(): Promise<GoogleUser | null> {
  return loadUser();
}
```

### 5.3 `AuthProvider.tsx`

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { GoogleUser } from '@ademhatay/expo-google-signin';
import { loginWithGoogle, logoutGoogle, restorePersistedUser } from './auth-service';

type AuthContextValue = {
  user: GoogleUser | null;
  loading: boolean;
  signInGoogle: (opts?: { androidButtonFlow?: boolean }) => Promise<void>;
  signOutGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const restored = await restorePersistedUser();
      setUser(restored);
      setLoading(false);
    })();
  }, []);

  async function signInGoogle(opts?: { androidButtonFlow?: boolean }) {
    const next = await loginWithGoogle(opts);
    setUser(next);
  }

  async function signOutGoogle() {
    await logoutGoogle();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInGoogle, signOutGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
```

### 5.4 Ekran Kullanımı

```tsx
import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { useAuth } from './AuthProvider';

export default function LoginScreen() {
  const { user, signInGoogle, signOutGoogle } = useAuth();

  if (user) {
    return (
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>
          Welcome {user.displayName || user.id}
        </Text>
        <Pressable onPress={signOutGoogle} style={{ marginTop: 16 }}>
          <Text>Sign out</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      {Platform.OS === 'ios' ? (
        <Pressable onPress={() => signInGoogle({ androidButtonFlow: false })}>
          <Text>Sign In with Google</Text>
        </Pressable>
      ) : (
        <>
          <Pressable onPress={() => signInGoogle({ androidButtonFlow: true })}>
            <Text>Sign In with Google (Button Flow)</Text>
          </Pressable>
          <Pressable onPress={() => signInGoogle({ androidButtonFlow: false })}>
            <Text>Sign In with One-Tap</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
```

## 6) Backend'de Token Doğrulama

`idToken`'ı doğrudan güvenip session açmayın. Backend'de doğrulayın.

```ts
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

export async function verifyGoogleIdToken(idToken: string, webClientId: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: webClientId
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error('Invalid token payload');

  return {
    googleSub: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified,
    name: payload.name,
    picture: payload.picture
  };
}
```

## 7) Sık Hatalar

### `serverClientId is required`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` eksik.
- `.env` uygulamaya yüklenmiyor.

### `Developer console is not set up correctly`
- SHA-1 yanlış.
- Package name yanlış.
- `serverClientId` olarak Web ID yerine Android/iOS ID verilmiş.

### `iosClientId is required for iOS`
- `iosClientId` yok.
- Plugin ayarı yok.
- Native rebuild yapılmadı.

## Sonuç

Bu kurulumla:
- Android ve iOS için tek auth akışı kurarsın.
- Kullanıcıyı local'de saklarsın.
- Güvenliği backend doğrulamasıyla tamamlarsın.

Üretime çıkmadan önce SHA-1, bundle ID ve consent screen ayarlarını tekrar kontrol et.
