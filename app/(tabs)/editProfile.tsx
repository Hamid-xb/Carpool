import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Account from '@/components/Edit-profile';
import EditProfile from "@/components/Edit-profile";

export default function EditProfileScreen() {
    return (
        <SafeAreaView>
            <ScrollView>
                <EditProfile/>
            </ScrollView>
        </SafeAreaView>
    );
}