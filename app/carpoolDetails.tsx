import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { getSupabaseClient } from '@/context/supabase';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';

dayjs.locale('nl');

export default function CarpoolDetails() {
  const supabase = getSupabaseClient();
  
  const [carpoolDetails, setCarpoolDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { rideId } = useLocalSearchParams();
  const id = Array.isArray(rideId) ? rideId[0] : rideId;


  useEffect(() => {
    async function getCarpoolDetails() {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver:driver_id (
            avatar_url,
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      else setCarpoolDetails(data);
    }
    
    getCarpoolDetails();
  }, [id, supabase]);

  const renderLocation = (locationData: string) => {
    try {
      const location = JSON.parse(locationData);
      return location.displayName;
    } catch (error) {
      return 'Locatie niet beschikbaar';
    }
  };

  const renderAddress = (locationData: string) => {
    try {
      const location = JSON.parse(locationData);
      return location.city;
    } catch (error) {
      return 'Adres niet beschikbaar';
    }
  };
  
  const renderName = (driverData: any) => {
    if (driverData.full_name && driverData.full_name.length > 16) {
      return driverData.full_name.slice(0, 14) + '...';
    }
    return driverData.full_name || 'Naam niet beschikbaar';
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'carpoolgegevens' }} />
      <ScrollView>
        <SafeAreaView className='flex-1 bg-gray-100'>
          <Card className='mx-4 mt-4 p-6 rounded-xl shadow-md'>
            {/* Header with date */}
            <View className='mb-6'>
              <Text className='text-lg font-bold text-gray-800'>
                {carpoolDetails?.date ? dayjs(carpoolDetails?.date).format('D MMMM YYYY') : 'Datum niet beschikbaar'}
              </Text>
            </View>

            {/* Times and locations */}
            <View className='mb-6'>
              <View className='flex-row items-start mb-4'>
                <Text className='text-gray-600 font-medium w-16'>Tijd</Text>
                <View>
                  <Text className='font-bold text-gray-800'>{ carpoolDetails?.date ? dayjs(carpoolDetails?.date).format('HH:mm') : 'Tijd niet beschikbaar' }</Text>
                </View>
              </View>
              <View className='flex-row items-start mb-4'>
                <Text className='text-gray-600 font-medium w-16'>Van</Text>
                <View>
                  <Text className='font-bold text-gray-800'>{ renderLocation(carpoolDetails?.start_location) }</Text>
                  <Text className='text-gray-600'>{ renderAddress(carpoolDetails?.start_location) }</Text>
                </View>
              </View>
              <View className='flex-row items-start'>
                <Text className='text-gray-600 font-medium w-16'>Naar</Text>
                <View>
                  <Text className='font-bold text-gray-800'>{ renderLocation(carpoolDetails?.end_location) }</Text>
                  <Text className='text-gray-600'>{ renderAddress(carpoolDetails?.end_location) }</Text>
                </View>
              </View>
            </View>

            <View className=''>
              <Text className='text-gray-500 text-sm'>1 Passagier</Text>
              <View
                style={{
                  borderBottomColor: 'gray',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
            </View>

            {/* Driver Info */}
            <View className='border-t border-gray-300 pt-4 mb-6'>
              <View className='flex-row items-center'>
                <View className='mr-4'>
                  <Avatar
                    size='lg'
                    source={{ uri: carpoolDetails?.driver?.avatar_url || undefined }}
                  />
                </View>
                <View>
                  <Text className='text-xl font-bold text-gray-800'>
                    { renderName(carpoolDetails?.driver) }
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View className='mb-6'>
              <Text className='text-gray-800 font-semibold mb-2'>
                Over de rit:
              </Text>
              <Text className='text-gray-600 leading-relaxed'>
                
              </Text>
            </View>

            {/* Info section */}
            <View className='border-t border-gray-300 pt-4 mb-6'>
              <Text className='text-gray-800 font-semibold mb-2'>Info:</Text>
              <View>
                <View className='flex-row'>
                  <Text className='text-gray-600'>Zit Plekken: </Text>
                  <Text className='text-gray-800 font-bold'>{ carpoolDetails?.seats || 0 }</Text>
                </View>
                <View className='flex-row'>
                  <Text className='text-gray-600'>Auto: </Text>
                  <Text className='text-gray-800 font-bold'>{ carpoolDetails?.car_model || 'Geen auto beschikbaar' }  </Text>
                </View>
              </View>
            </View>

            {/* Preferences */}
            <View className='border-t border-gray-300 pt-4 mb-8'>
              <Text className='text-gray-800 font-semibold mb-2'>
                Voorkeuren:
              </Text>
              <View className='flex-row items-center mb-2'>
                <Text className='text-gray-700'>{ carpoolDetails?.prefrence || 'Geen voorkeuren' }</Text>
              </View>
            </View>
          </Card>

          {/* Action buttons */}
          <View className='gap-4 mx-4 mb-6 mt-4'>
            <TouchableOpacity className='border border-blue-500 rounded-lg py-3 px-6 flex-1'>
              <Text className='text-blue-500 font-bold text-center'>
                Stuur Hans een bericht
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-blue-500 rounded-lg py-3 px-6 flex-1'>
              <Text className='text-white font-bold text-center'>Boeken</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}