import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { AutoCompleteLocation } from '@/components/AutoCompleteLocation';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@/components/ui/slider';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { View } from '@/components/ui/view';
import { useAuth } from '@/context/useAuth';
import { getUserCars } from '@/libs/getUserCars';
import { PREFERENCES } from '@/libs/ridePrefences';
import { showError } from '@/libs/showError';
import { updateRecord } from '@/libs/updateRecord';


export default function CreateCarpool() {
  const { session } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const devMode = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

  const [page, setPage] = useState<number>(1);
  const [datetime, setDatetime] = useState(new Date());
  const [seats, setSeats] = useState(1);
  const [driveInfo, setDriveInfo] = useState<string>();
  const [startLocation, setStartLocation] = useState();
  const [endLocation, setEndLocation] = useState();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');

  const handleLocationData = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    feature: any,
  ) => {
    const { country, state, city, postcode, name, street, housenumber } =
      feature;

    const locationData = {
      country,
      state,
      city,
      postcode,
      name,
      street,
      housenumber,
      displayName: [name || street, housenumber].filter(Boolean).join(', '),
    };

    setter(JSON.stringify(locationData));
  };

  const togglePreference = (preferenceId: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preferenceId)
        ? prev.filter((id) => id !== preferenceId)
        : [...prev, preferenceId],
    );
  };

  const onChange = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || datetime;
    setShow(false);
    setDatetime(currentDate);
  };

  const showMode = (currentMode: string) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSliderChange = (value: number) => {
    setSeats(value);
  };

  const isNextDisabled = () => {
    if (page === 1) return !startLocation;
    if (page === 2) return !endLocation;
    return false;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (devMode) {
        console.log('[DEV MODE] Carpool created:', {
          location,
          datetime,
          seats,
          driveInfo,
          selectedPreferences: JSON.stringify(selectedPreferences),
        });
        Alert.alert('Carpool created! (dev mode)');
        return;
      }
      const userId = session?.user.id;

      const car = await getUserCars(userId);
      const carId = car.id;

      await updateRecord({
        session,
        table: 'rides',
        data: {
          created_at: new Date(),
          driver_id: session?.user?.id,
          car_id: carId,
          start_location: startLocation,
          end_location: endLocation,
          date: datetime.toISOString(),
          seats_available: seats,
          updated_at: new Date(),
          preferences: JSON.stringify(selectedPreferences),
          ride_info: driveInfo,
        },
      });
      Alert.alert('Carpool created successfully!');
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
      router.push('/drive');
    }
  };

  const renderContent = () => {
    if (page === 1) {
      return (
        <View className='flex-1 items-center'>
          <View className='flex items-center pt-2'>
            <Heading size='xl' className='pb-2'>
              Waar vertrek je?
            </Heading>
            <Text>Dit is de plek waar je de passagiers ophaalt</Text>
          </View>
          <AutoCompleteLocation
            value={startLocation ? JSON.parse(startLocation).displayName : ''}
            onSelect={(feature) =>
              handleLocationData(setStartLocation, feature)
            }
          />
        </View>
      );
    }

    if (page === 2) {
      return (
        <View className='flex-1 items-center'>
          <Heading size='xl' className='pt-2'>
            Waar ga je naar toe?
          </Heading>
          <AutoCompleteLocation
            value={endLocation ? JSON.parse(endLocation).displayName : ''}
            onSelect={(feature) => handleLocationData(setEndLocation, feature)}
          />
        </View>
      );
    }

    if (page === 3) {
      return (
        <View className='flex-1 p-4'>
          <View className='pb-10'>
            <Heading size='xl' className='text-center'>
              Waneer vertrek je?
            </Heading>
            <Card className='p-4 mb-4 text-center justify-center items-center'>
              <Text size='lg' bold>
                {formatDate(datetime)}
              </Text>
            </Card>

            <Button variant='outline' onPress={showDatepicker}>
              <ButtonText>📅 Verander Datum</ButtonText>
            </Button>
          </View>

          <View>
            <Heading size='xl' className='text-center'>
              Hoelaat Vertrek je?
            </Heading>
            <Card className='p-4 mb-4 flex text-center justify-center items-center'>
              <Text size='lg' bold>
                {formatTime(datetime)}
              </Text>
            </Card>

            <Button variant='outline' onPress={showTimepicker}>
              <ButtonText>⏰ Verander Tijd</ButtonText>
            </Button>
          </View>

          {show && (
            <DateTimePicker
              testID='dateTimePicker'
              value={datetime}
              mode={mode as any}
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </View>
      );
    }

    if (page === 4) {
      return (
        <ScrollView className='flex-1 p-4'>
          <Card className='p-4 mb-5'>
            <Heading size='xl' className='text-center mb-4'>
              Aantal zitplaatsen: {seats}
            </Heading>
            <Slider
              size='lg'
              defaultValue={1}
              value={seats}
              onChange={handleSliderChange}
              step={1}
              minValue={1}
              maxValue={10}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Card>

          <Card className='mb-5'>
            <Heading className='text-center text-lg font-semibold mb-4'>
              Voorkeuren
            </Heading>
            <Box className='flex flex-row flex-wrap items-stretch gap-2'>
              {PREFERENCES.map((pref) => (
                <Button
                  key={pref.id}
                  variant={
                    selectedPreferences.includes(pref.id) ? 'solid' : 'outline'
                  }
                  className='min-w-[45%] flex-grow mb-2'
                  onPress={() => togglePreference(pref.id)}
                >
                  <ButtonText className='whitespace-normal text-center'>
                    {pref.label}
                  </ButtonText>
                </Button>
              ))}
            </Box>
          </Card>

          <Card>
            <Textarea>
              <TextareaInput
                placeholder='Voeg eventuele aanvullende informatie toe...'
                value={driveInfo}
                onChangeText={setDriveInfo}
              />
            </Textarea>
          </Card>
        </ScrollView>
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Carpool Aanmaken' }} />
      <View className='flex-1'>
        {renderContent()}

        <View className='bg-gray-400 p-4 flex flex-row gap-5'>
          {page !== 1 && (
            <Button className='flex-1' onPress={() => setPage(page - 1)}>
              <ButtonText>Terug</ButtonText>
            </Button>
          )}
          {page !== 4 ? (
            <Button
              disabled={isNextDisabled()}
              variant={isNextDisabled() ? 'outline' : 'solid'}
              className='flex-1'
              onPress={() => setPage(page + 1)}
            >
              <ButtonText>Volgende</ButtonText>
            </Button>
          ) : (
            <Button className='flex-1' onPress={handleSubmit} disabled={loading}>
              <ButtonText>{loading ? 'Creëren...' : 'Aanmaken'}</ButtonText>
            </Button>
          )}
        </View>
      </View>
    </>
  );
}
