import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CarpoolCard } from '@/components/CarpoolCard';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverArrow,
  PopoverBackdrop,
  PopoverBody,
  PopoverContent,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useSession } from '@/context/session-context';
import { getUserCars } from '@/libs/getUserCars';
import { getUserRides } from '@/libs/getUserRides';

export default function drive() {
  const session = useSession();
  const userId = session.user.id;

  const [isOpen, setIsOpen] = useState(false);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCar, setHasCar] = useState(null);

  const fetchRidesData = async () => {
    try {
      setLoading(true);
      const ridesData = await getUserRides(userId);

      if (ridesData && ridesData.length > 0) {
        const processedRides = ridesData.map((ride) => {
          const endLocation = JSON.parse(ride.end_location);
          const StartLocation = JSON.parse(ride.start_location);

          return {
            id: ride.id,
            avatarUrl: ride.driver?.avatar_url,
            toLocation: endLocation.displayName,
            fromLocation: StartLocation.displayName,
            dateTime: ride.date,
          };
        });

        setRides(processedRides);
      } else {
        setRides([]);
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const checkIsCar = async () => {
    try {
      const car = await getUserCars(userId);
      setHasCar(car !== null);
    } catch (error) {
      console.error('Error checking car:', error);
      setHasCar(false);
    }
  };

  const handleCreateCarpool = async () => {
    if (hasCar) {
      router.push('/createCarpool');
    } else {
      handleOpen();
    }
  };

  const formatRideDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('nl-NL', { weekday: 'long', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
  };

  useEffect(() => {
    fetchRidesData();
    checkIsCar();
  }, []);

  if (hasCar === null) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Spinner size='large' />
      </View>
    );
  }

  return (
    <SafeAreaView className='flex-1'>
        <View className='flex-1 m-3 bg-gray-400 p-0 rounded'>
          <Card className='bg-gray-500 m-0'>
            {hasCar ? (
              <Button size='lg' onPress={handleCreateCarpool}>
                <ButtonIcon as={Plus} />
                <ButtonText>Maak een Carpool aan</ButtonText>
              </Button>
            ) : (
              <Popover
                isOpen={isOpen}
                onClose={handleClose}
                onOpen={handleOpen}
                placement='bottom'
                size='md'
                trigger={(triggerProps) => {
                  return (
                    <Button size='lg' {...triggerProps}>
                      <ButtonIcon as={Plus} />
                      <ButtonText>Maak een Carpool aan</ButtonText>
                    </Button>
                  );
                }}
              >
                <PopoverBackdrop />
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    <Text className='text-typography-900'>
                      Je moet eerst een auto toevoegen voordat je een carpool
                      kunt aanmaken.
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
          </Card>

          {loading ? (
            <View className='flex-1 justify-center items-center'>
              <Spinner size='large' />
            </View>
          ) : rides.length > 0 ? (
            <ScrollView className='p-3'>
              {rides.map((ride) => (
                <View className='mt-5'>
                  <CarpoolCard
                    key={ride.id}
                    time={formatRideDate(ride.dateTime)}
                    startLocation={ride.fromLocation}
                    endLocation={ride.toLocation}
                    avatar={ride.avatarUrl}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className='flex-1 justify-center items-center'>
              <Text size='xl' bold>
                Maak nu een carpool aan!
              </Text>
            </View>
          )}
        </View>
    </SafeAreaView>
  );
}
