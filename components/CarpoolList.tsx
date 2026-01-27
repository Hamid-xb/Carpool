import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSession } from '@/context/session-context';
import { getUserRides } from '@/libs/getUserRides';
import { CarpoolCard } from './CarpoolCard';
import { router } from 'expo-router';

// Define your stack param list
type RootStackParamList = {
  showCarpool: undefined;
  // add other screens if needed
};

type Ride = {
  id: string;
  avatarUrl?: string;
  toLocation: string;
  fromLocation: string;
  dateTime: string;
};

type Props = {
  // Filter functie voor carpool op basis van geselecteerde locatie
  selectedStartLocation?: string;
  selectedEndLocation?: string;

  // Datum geselecteerd in de datumkiezer
  selectedDate: Date;
};

export function CarpoolList({
  selectedDate,
  selectedStartLocation,
  selectedEndLocation,
}: Props) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const session = useSession();
  const userId = session.user.id;

  const fetchRidesData = async () => {
    try {
      setLoading(true);
      const ridesData = await getUserRides(userId);

      if (ridesData && ridesData.length > 0) {
        const processedRides = ridesData.map((ride) => {
          const startLocation = JSON.parse(ride.start_location);
          const endLocation = JSON.parse(ride.end_location);

          return {
            id: ride.id,
            avatarUrl: ride.driver?.avatar_url,
            fromLocation: startLocation.displayName,
            toLocation: endLocation.displayName,
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

  const formatRideDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('nl-NL', { weekday: 'long', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
  };

  useEffect(() => {
    if (userId) {
      fetchRidesData();
    }
  }, [userId]);

  return (
    <View>
      {loading && <Text>Loading...</Text>}

      {rides
        .sort(
          (a, b) =>
            new Date(b.dateTime).valueOf() - new Date(a.dateTime).valueOf(),
        )
        .filter((ride) => {
          const sameDate =
            ride.dateTime.slice(0, 10) ===
            selectedDate.toISOString().slice(0, 10);

          const sameStart =
            !selectedStartLocation ||
            ride.fromLocation === selectedStartLocation.displayName;

          const sameEnd =
            !selectedEndLocation ||
            ride.toLocation === selectedEndLocation.displayName;

          return sameDate && sameStart && sameEnd;
        })
        .map((ride) => (
          <View className='mt-5 bg-white rounded-xl' key={ride.id}>
            <CarpoolCard 
              time={formatRideDate(ride.dateTime)}
              startLocation={ride.fromLocation}
              endLocation={ride.toLocation}
              avatar={ride.avatarUrl}
              onPress={() => navigation.navigate('showCarpool', { rideId: ride.id })}
            />
          </View>
        ))}
    </View>
  );
}
