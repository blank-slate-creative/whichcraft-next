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
      <View className="flex-1 bg-white dark:bg-gray-900 p-6 justify-center items-center">
        <Text className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Check your email
        </Text>
        <Text className="text-center text-gray-600 dark:text-gray-400 mb-8">
          We've sent you a confirmation email. Please check your inbox and
          follow the instructions to complete your registration.
        </Text>
        <Link href="/sign-in" asChild>
          <TouchableOpacity className="w-64 h-12 bg-blue-600 rounded-lg items-center justify-center">
            <Text className="text-white font-medium">Return to Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-6">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Create an Account
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password
            </Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Confirm Password
            </Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            className="w-full h-12 bg-blue-600 rounded-lg items-center justify-center mt-4"
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ?
              <ActivityIndicator color="#FFFFFF" />
            : <Text className="text-white font-medium">Sign Up</Text>}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
          </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
