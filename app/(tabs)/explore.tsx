import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CarpoolCard } from '@/components/CarpoolCard';
import { Card } from '@/components/ui/card';
import { getSupabaseClient } from '@/context/supabase';

export default function ExploreScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (event: any, date?: Date) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    if (date) {
      setSelectedDate(date);
    }

    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  };

  const showDatePicker = () => {
    setMode('date');
    setShowPicker(true);
  };
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const supabase = getSupabaseClient();
  const [error, setError] = useState(null);
  const [carpools, setCarpools] = useState(null);

  useEffect(() => {
    const fetchCarpools = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select()

      if (error) {
        setError('something went wrong while fetching carpools');
        setCarpools(null);
        console.error(error);
      }
      if (data) {
        setCarpools(data);
        setError(null);
      }
    }
    fetchCarpools();
  }, []);   
  
    const formatRideDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('nl-NL', { weekday: 'long', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
  };

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

          {/* Date Selection - Direct under search without padding/margin */}
          <Pressable
          onPress={showDatePicker}
            className='bg-white border border-gray-300 rounded-xl p-4 flex-row items-center justify-between active:bg-gray-50 my-4'
          >
            <View className='flex-row items-center'>
              <Text className='text-lg mr-3'>📅</Text>
              <Text className='text-lg text-gray-800'>
                {selectedDate.toLocaleDateString('nl-NL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <Text className='text-blue-600 font-semibold'>Wijzigen</Text>
          </Pressable>

          {/* Modal for iOS */}
          <ScrollView>
            {Platform.OS === 'ios' && showPicker && (
              <Modal
                visible={showPicker}
                transparent
                animationType='slide'
                onRequestClose={() => setShowPicker(false)}
              >
                <View className='flex-1 justify-end bg-black/50'>
                  <View className='bg-white rounded-t-3xl p-6 max-h-3/4'>
                    <View className='flex-row justify-between items-center mb-6'>
                      <Text className='text-xl font-bold text-gray-800'>
                        Selecteer datum
                      </Text>
                      <Pressable
                        onPress={() => setShowPicker(false)}
                        className='w-8 h-8 items-center justify-center'
                      >
                        <Text className='text-2xl text-gray-400'>×</Text>
                      </Pressable>
                    </View>

                    <DateTimePicker
                      value={selectedDate}
                      mode={mode}
                      display='spinner'
                      onChange={handleChange}
                      locale='nl-NL'
                    />

                    <View className='flex-row gap-3 mt-6'>
                      <Pressable
                        onPress={() => setShowPicker(false)}
                        className='flex-1 border border-gray-300 rounded-xl py-4'
                      >
                        <Text className='text-center text-gray-600 font-medium'>
                          Annuleren
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setShowPicker(false)}
                        className='flex-1 bg-blue-500 rounded-xl py-4'
                      >
                        <Text className='text-center text-white font-medium'>
                          Bevestigen
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {/* Android inline picker */}
            {Platform.OS === 'android' && showPicker && (
              <DateTimePicker
                value={selectedDate}
                mode={mode}
                display='default'
                onChange={handleChange}
                locale='nl-NL'
              />
            )}

            {/* Cards voorbeeld */}
            {error && (<p>{ error }</p>)}
            {carpools && (
              <View>
                {carpools.map(carpool => {
                  const start_location = JSON.parse(carpool.start_location);
                  const end_location = JSON.parse(carpool.end_location);
                  if (carpool.date.slice(0,10) === selectedDate.toISOString().slice(0,10)) {
                  return (                   
                    <View className="mt-5" key={carpool.id}>
                      <CarpoolCard
                        key={carpool.id}
                        time={formatRideDate(carpool.date)} 
                        startLocation={start_location.city}
                        endLocation={end_location.city}
                        avatar={'image'}
                      />
                   </View>
                  )
                  }})}
              </View>
            )}
          </ScrollView>
        </Card>
      </View>
    </SafeAreaView> 
  );
}