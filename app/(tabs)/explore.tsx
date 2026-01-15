import { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import DatePickerField from '@/components/DatePickerField';
import { CarpoolList } from '@/components/CarpoolList';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  const [error, setError] = useState(null);

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
          {/* Zoeken functie */}
          <View className='mb-0'>
            <TextInput
              placeholder='Zoeken...'
              value={searchQuery}
              onChangeText={setSearchQuery}
              className='bg-white border border-gray-300 rounded-xl px-4 py-3 text-lg'
              placeholderTextColor='#9CA3AF'
            />
          </View>

          {/* Datum Pikker */}
          <DatePickerField
            value={selectedDate}
            onChange={setSelectedDate}
          />
          <ScrollView>
            {error && (<Text>{error}</Text>)}

            <CarpoolList selectedDate={selectedDate} />
          </ScrollView>
        </Card>
      </View>
    </SafeAreaView> 
  );
}