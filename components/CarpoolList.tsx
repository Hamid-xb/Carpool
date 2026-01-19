import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSession } from '@/context/session-context';
import { getUserRides } from '@/libs/getUserRides';
import { CarpoolCard } from './CarpoolCard';

type Ride = {
  id: string;
  avatarUrl?: string;
  toLocation: string;
  fromLocation: string;
  dateTime: string;
};

type Props = {
  selectedDate: Date;
  sort: (a: Ride, b: Ride) => number;
};

export function CarpoolList({ selectedDate }: Props) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const userId = session.user.id;

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
    <ScrollView>
      {loading && <Text>Loading...</Text>}

      {rides
        .sort((a, b) => {
          const dateA = new Date(`${a.dateTime}`).valueOf();
          const dateB = new Date(`${b.dateTime}`).valueOf();
          if (dateA > dateB) {
            return -1; // return -1 here for DESC order
          }
          return 1; // return 1 here for DESC Order
        })
        .filter(
          (ride) =>
            ride.dateTime.slice(0, 10) ===
            selectedDate.toISOString().slice(0, 10),
        )
        .map((ride) => (
          <View className='mt-5' key={ride.id}>
            <CarpoolCard
              time={formatRideDate(ride.dateTime)}
              startLocation={ride.fromLocation}
              endLocation={ride.toLocation}
              avatar={ride.avatarUrl}
            />
          </View>
        ))}
    </ScrollView>
  );
}
