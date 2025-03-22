import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { Link, router } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";

export default function SignInScreen() {
  const isDarkMode = useColorScheme() === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const { signIn, signInWithApple, isAppleAuthAvailable } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      const { error, session } = await signInWithApple();
      if (error) {
        Alert.alert("Error", error.message);
      } else if (session) {
        router.replace("/");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="p-6"
        >
          <View className="flex-1 justify-center">
            <Text className="text-3xl font-bold text-center mb-8 text-foreground">
              Sign In to WhichCraft
            </Text>

            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium mb-1 text-muted-foreground">
                  Email
                </Text>
                <TextInput
                  className="w-full h-12 px-4 border border-border rounded-lg bg-background text-foreground"
                  placeholder="you@example.com"
                  placeholderTextColor="rgb(var(--muted-foreground))"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View>
                <Text className="text-sm font-medium mb-1 text-muted-foreground">
                  Password
                </Text>
                <TextInput
                  className="w-full h-12 px-4 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Your password"
                  placeholderTextColor="rgb(var(--muted-foreground))"
                  secureTextEntry
                  textContentType="password"
                  autoComplete="password"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                className="w-full h-12 bg-primary rounded-lg items-center justify-center mt-4"
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ?
                  <ActivityIndicator color="rgb(var(--primary-foreground))" />
                : <Text className="text-primary-foreground font-medium">
                    Sign In
                  </Text>
                }
              </TouchableOpacity>

              {isAppleAuthAvailable && (
                <View className="gap-4">
                  <Text className="text-center text-muted-foreground">or</Text>
                  {appleLoading ?
                    <View className="w-full h-12 border border-border rounded-lg items-center justify-center">
                      <ActivityIndicator color="rgb(var(--foreground))" />
                    </View>
                  : <AppleAuthentication.AppleAuthenticationButton
                      buttonType={
                        AppleAuthentication.AppleAuthenticationButtonType
                          .SIGN_IN
                      }
                      buttonStyle={
                        isDarkMode ?
                          AppleAuthentication.AppleAuthenticationButtonStyle
                            .WHITE
                        : AppleAuthentication.AppleAuthenticationButtonStyle
                            .BLACK
                      }
                      cornerRadius={8}
                      style={{
                        height: 44,
                        width: "100%",
                      }}
                      onPress={handleAppleSignIn}
                    />
                  }
                </View>
              )}
            </View>

            <View className="flex-row justify-center mt-6">
              <Text className="text-muted-foreground">
                Don't have an account?{" "}
              </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="text-accent-foreground font-medium">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
