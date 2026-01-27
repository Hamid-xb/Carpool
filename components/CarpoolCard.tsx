import { Avatar, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Heading } from './ui/heading';
import { Pressable, View, Text } from 'react-native';

export function CarpoolCard({ time, startLocation, endLocation, avatar, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Card variant='elevated' className='p-3 rounded-xl'>
        <View className='flex-row items-center'>
          <Avatar className='w-12 h-12 rounded-full mr-4'>
            <AvatarImage source={{ uri: avatar }} />
          </Avatar>

          <View className='flex-1'>
            <Heading size='md'>
              {startLocation} → {endLocation}
            </Heading>
            <Text size='sm' className='mt-1'>
              {time}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}