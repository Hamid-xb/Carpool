import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Account from '@/components/Account';

export default function ProfileScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Account />
      </ScrollView>
    </SafeAreaView>
  );
}
