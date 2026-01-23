import { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { CarpoolList } from '@/components/CarpoolList';
import DatePickerField from '@/components/DatePickerField';
import { AutoCompleteLocation } from '@/components/AutoCompleteLocation';

export default function ExploreScreen() {
  // Locatie zoekvelden
  const [startLocation, setStartLocation] = useState<any>(null);
  const [endLocation, setEndLocation] = useState<any>(null);

  const handleLocationData = (setter: any, feature: any) => {
    const { country, state, city, postcode, name, street, housenumber } = feature;

    setter({
      country,
      state,
      city,
      postcode,
      displayName: [name || street, housenumber].filter(Boolean).join(', '),
    });
  };
  // tijdpikker
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Fout afhandeling
  const [error, setError] = useState(null);

  // filters resetten
  function resetFilters() {
    if ( startLocation !== null || endLocation !== null ) {
      setStartLocation(null);
      setEndLocation(null);
    }
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1 bg-gray-100 w-full mx-auto'>
        <View className='pb-6'>
          <Text className='text-3xl font-bold text-gray-800 mx-auto'>
            Carpools{' '}
            {isToday
              ? 'Vandaag'
              : selectedDate.toLocaleDateString('nl-NL', { weekday: 'long' })}
          </Text>
        </View>

        {/* Main Card */}
        <Card className='flex-1 rounded-2xl shadow-lg bg-[#9ca3af] border-0 mx-4 mb-4'>
          {/*reset zoeken functie*/}
          {(startLocation !== null || endLocation !== null) && (
            <View className='px-4 pt-4 flex-row justify-end w-full'>
              <Text className='text-blue-600 underline' onPress={resetFilters}>
                Reset
              </Text>
            </View>
          )}
          
          {/* Zoeken functie */}
          <View className='flex-row justify-between my-2 w-full'>
            <View className='w-1/2 pr-2'>
              <Text className='text-lg font-semibold text-gray-700 mb-2 py'>
                Vertrekpunt
              </Text>
              <AutoCompleteLocation
                value={startLocation?.displayName ?? ''}
                onSelect={(feature) => handleLocationData(setStartLocation, feature)
                }
                placeholder='Bijv. Groningen...'
              />
            </View>
            <View className='w-1/2 pl-2'>
              <Text className='text-lg font-semibold text-gray-700 mb-2'>
                Bestemming
              </Text>
              <AutoCompleteLocation
                value={endLocation?.displayName ?? ''}
                onSelect={(feature) => 
                  handleLocationData(setEndLocation, feature)
                }
                placeholder='Bijv. Assen...'
              />
            </View>
          </View>

          {/* Datum Pikker */}
          <DatePickerField
            value={selectedDate}
            onChange={setSelectedDate}
          />
          {error && (<Text>{error}</Text>)}

          <CarpoolList selectedDate={selectedDate} selectedStartLocation={startLocation} selectedEndLocation={endLocation} />
        </Card>
      </View>
    </SafeAreaView>
  );
}