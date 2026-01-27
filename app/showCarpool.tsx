import { Stack } from 'expo-router';
import { Card } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui/avatar';


export default function CarpoolList() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'carpoolgegevens' }} />
      <ScrollView>
        <SafeAreaView className="flex-1 bg-gray-100">
          <Card className="mx-4 mt-4 p-6 rounded-xl shadow-md">
            
            {/* Header with date */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800">Maandag 15 September</Text>
            </View>

            {/* Times and locations */}
            <View className="mb-6">
              <View className="flex-row items-start mb-4">
                <Text className="text-gray-600 font-medium w-16">Tijd</Text>
                <View>
                  <Text className="font-bold text-gray-800">08:30 AM</Text>
                </View>
              </View>
              <View className="flex-row items-start mb-4">
                <Text className="text-gray-600 font-medium w-16">Van</Text>
                <View>
                  <Text className="font-bold text-gray-800">Groningen</Text>
                  <Text className="text-gray-600">Hoofdstation</Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Text className="text-gray-600 font-medium w-16">Naar</Text>
                <View>
                  <Text className="font-bold text-gray-800">Assen</Text>
                  <Text className="text-gray-600">willhelmina ziekenhuis</Text>
                </View>
              </View>
            </View>
            
            <View className="">
              <Text className="text-gray-500 text-sm">1 Passagier</Text>
              <View
                style={{
                  borderBottomColor: 'gray',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
            </View>

            {/* Driver Info */}
            <View className="border-t border-gray-300 pt-4 mb-6">
              <View className="flex-row items-center">
                <View className="mr-4">
                  <Avatar
                    size="lg"
                    source={{ uri: 'https://example.com/avatar.jpg' }}
                  />
                </View>
                <View>
                  <Text className="text-xl font-bold text-gray-800">Hans Aardappel</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-gray-800 font-semibold mb-2">Over de rit:</Text>
              <Text className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </Text>
            </View>

            {/* Info section */}
            <View className="border-t border-gray-300 pt-4 mb-6">
              <Text className="text-gray-800 font-semibold mb-2">Info:</Text>
              <View>
                <View className="flex-row">
                  <Text className="text-gray-600">Zit Plekken: </Text>
                  <Text className="text-gray-800 font-bold"> 3</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-600">Auto: </Text>
                  <Text className="text-gray-800 font-bold">VAZ-2101</Text>
                </View>
              </View>
            </View>

            {/* Preferences */}
            <View className="border-t border-gray-300 pt-4 mb-8">
              <Text className="text-gray-800 font-semibold mb-2">Voorkeuren:</Text>
              <View className="flex-row items-center mb-2">
                <View className="w-3 h-3 bg-red-500 rounded-full mr-3"></View>
                <Text className="text-gray-700">Geen roker</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-3"></View>
                <Text className="text-gray-700">Een prater</Text>
              </View>
            </View>
          </Card>

          {/* Action buttons */}
          <View className="gap-4 mx-4 mb-6 mt-4">
            <TouchableOpacity className="border border-blue-500 rounded-lg py-3 px-6 flex-1">
              <Text className="text-blue-500 font-bold text-center">Stuur Hans een bericht</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-500 rounded-lg py-3 px-6 flex-1">
              <Text className="text-white font-bold text-center">Boeken</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}