import { getSupabaseClient } from '@/context/supabase';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { CarpoolCard } from './CarpoolCard';

type Carpool = {
  id: string;
  date: string;
  start_location: string;
  end_location: string;
};

export function CarpoolList() {
  const supabase = getSupabaseClient();

  const [carpools, setCarpools] = useState<Carpool[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate] = useState(new Date());

  useEffect(() => {
    const fetchCarpools = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select()

      if (error) {
        setError('something went wrong while fetching carpools');
        console.error(error);
      }
     
      setCarpools(data ?? []);
    }
    
    fetchCarpools();
  }, []);   
  
    const formatRideDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })} ${date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

return (
    <ScrollView>
      {error && <Text>{error}</Text>}

      {carpools
        .filter(
          carpool =>
            carpool.date.slice(0, 10) ===
            selectedDate.toISOString().slice(0, 10)
        )
        .map(carpool => {
          const start_location = JSON.parse(carpool.start_location);
          const end_location = JSON.parse(carpool.end_location);

          return (
            <View key={carpool.id} style={{ marginTop: 20 }}>
              <CarpoolCard
                time={formatRideDate(carpool.date)}
                startLocation={start_location.city}
                endLocation={end_location.city}
                avatar="image"
              />
            </View>
          );
        })}
    </ScrollView>
  );
}