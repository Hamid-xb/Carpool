import { useEffect, useState } from 'react';
import { Alert, View, Text } from 'react-native';
import { useSession } from '@/context/session-context';
import { getSupabaseClient } from '@/context/supabase';
import { getSingleRecord } from '@/libs/getSingleRecord';
import { getUserCars } from '@/libs/getUserCars';
import { showError } from '@/libs/showError';
import { updateRecord } from '@/libs/updateRecord';
import UserAvatar from './UserAvatar';
import { Button, ButtonText } from './ui/button';
import { Input, InputField } from './ui/input';
import { router } from 'expo-router';


export default function EditProfile() {
    const session = useSession();
    const devMode = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
    const userId = session.user?.id;

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const [carId, setCarId] = useState<string>('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [seats, setSeats] = useState<number | null>(null);
    const [color, setColor] = useState('');

    interface Profile {
        full_name: string;
        phone: string;
        avatar_url: string;
        address: string;
        postal_code: string;
    }

    useEffect(() => {
        if(session.user) fetchUserProfile();
    }, [session]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);

            if (devMode) {
                setFullName('Development User');
                setPhone('+1234567890');
                setAvatarUrl('');
                setAddress('123 Dev St');
                setPostalCode('00000');
                setCarId('dev-car-id');
                setBrand('DevBrand');
                setModel('DevModel');
                setSeats(4);
                setColor('Red');
                return
            }

            const [profile, car] = await Promise.all([
                getSingleRecord<Profile>('profiles', userId),
                getUserCars(userId),
            ]);
            if (profile) {
                setFullName(profile.full_name || "");
                setPhone(profile.phone || "");
                setAddress(profile.address || "");
                setPostalCode(profile.postal_code || "");
                setAvatarUrl(profile.avatar_url || "");
            }
            if (car) {
                setCarId(car.id || '')
                setBrand(car.brand || '');
                setModel(car.model || '');
                setSeats(car.seats || '');
                setColor(car.color || '');
            }
        } catch (error) {
            showError(error);
        } finally {
            setLoading(false);
        }

        if (loading) {
            return (
                <View className="flex-1 justify-center items-center">
                    <Text>Loading profile...</Text>
                </View>
            );
        }
    }

    const handleAvatarUpload = async () => {}

    return (
        <View>
            <View className="flex-1 justify-center items-center pb-10">
                <View className="justify-center items-center pb-10">
                    <UserAvatar
                        size={200}
                        url={avatarUrl}
                        onUpload={(url: string) => handleAvatarUpload(url)}
                        disabled= {true}
                        showUploadButton={false}
                    />
                </View>

                <View className="w-full px-6">
                    <Text className="text-xl font-bold mb-4">Profile Information</Text>

                    <View className="bg-white p-4 rounded-xl shadow-md space-y-2">

                        <Text className="text-base text-gray-600">Full Name</Text>
                        <Text className="text-lg font-medium mb-3">{fullName || "-"}</Text>

                        <Text className="text-base text-gray-600">Phone</Text>
                        <Text className="text-lg font-medium mb-3">{phone || "-"}</Text>

                        <Text className="text-base text-gray-600">Address</Text>
                        <Text className="text-lg font-medium mb-3">{address || "-"}</Text>

                        <Text className="text-base text-gray-600">Postal Code</Text>
                        <Text className="text-lg font-medium mb-3">{postalCode || "-"}</Text>

                        <Text className="text-base text-gray-600">Car Brand</Text>
                        <Text className="text-lg font-medium mb-3">{brand || "-"}</Text>

                        <Text className="text-base text-gray-600">Model</Text>
                        <Text className="text-lg font-medium mb-3">{model || "-"}</Text>

                        <Text className="text-base text-gray-600">Seats</Text>
                        <Text className="text-lg font-medium mb-3">{seats || "-"}</Text>

                        <Text className="text-base text-gray-600">Color</Text>
                        <Text className="text-lg font-medium mb-3">{color || "-"}</Text>
                    </View>

                    <Button onPress={() => router.push('/profile')}>
                        <ButtonText>Ga naar Account</ButtonText>
                    </Button>
                </View>

            </View>
        </View>
    );
}