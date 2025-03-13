import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { Link } from "expo-router";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error, session } = await signUp(email, password);
      if (error) {
        Alert.alert("Error", error.message);
      } else if (!session) {
        // If no session is returned, the user needs to confirm their email
        setSuccess(true);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-background p-6 justify-center items-center">
        <Text className="text-2xl font-bold text-center mb-4 text-foreground">
          Check your email
        </Text>
        <Text className="text-center text-muted-foreground mb-8">
          We've sent you a confirmation email. Please check your inbox and
          follow the instructions to complete your registration.
        </Text>
        <Link href="/sign-in" asChild>
          <TouchableOpacity className="w-64 h-12 bg-primary rounded-lg items-center justify-center">
            <Text className="text-primary-foreground font-medium">
              Return to Sign In
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-6">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-center mb-8 text-foreground">
          Create an Account
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
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1 text-muted-foreground">
              Confirm Password
            </Text>
            <TextInput
              className="w-full h-12 px-4 border border-border rounded-lg bg-background text-foreground"
              placeholder="Confirm your password"
              placeholderTextColor="rgb(var(--muted-foreground))"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            className="w-full h-12 bg-primary rounded-lg items-center justify-center mt-4"
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ?
              <ActivityIndicator color="rgb(var(--primary-foreground))" />
            : <Text className="text-primary-foreground font-medium">
                Sign Up
              </Text>
            }
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-muted-foreground">
            Already have an account?{" "}
          </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-accent-foreground font-medium">
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
