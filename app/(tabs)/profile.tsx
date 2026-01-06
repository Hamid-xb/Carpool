import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Profile from "@/components/Profile";

export default function ProfileScreen() {
    return (
        <SafeAreaView>
            <ScrollView>
                <Profile/>
            </ScrollView>
        </SafeAreaView>
    );
}