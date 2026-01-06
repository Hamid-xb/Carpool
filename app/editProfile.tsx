import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfile from "@/components/EditProfile";

export default function EditProfileScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <EditProfile />
      </ScrollView>
    </SafeAreaView>
  );
}
