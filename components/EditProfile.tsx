import { useEffect, useState } from 'react';
import {Alert, View, SafeAreaView} from 'react-native';
import { useSession } from '@/context/session-context';
import { getSupabaseClient } from '@/context/supabase';
import { getSingleRecord } from '@/libs/getSingleRecord';
import { getUserCars } from '@/libs/getUserCars';
import { saveCarData } from '@/libs/saveCarData';
import { showError } from '@/libs/showError';
import { updateRecord } from '@/libs/updateRecord';
import UserAvatar from './UserAvatar';
import { Button, ButtonText } from './ui/button';
import { Input, InputField } from './ui/input';


import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';

export default function EditProfile() {
  const session = useSession();
  const devMode = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
  const [loading, setLoading] = useState(true);

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

  const userId = session.user.id;

  useEffect(() => {
    if (session.user) fetchUserData();
  }, [session]);

  async function fetchUserData() {
    try {
      setLoading(true);

      if (devMode) {
        // Mock profile and car for dev mode
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
        return;
      }

      const [profile, car] = await Promise.all([
        getSingleRecord<Profile>('profiles', userId),
        getUserCars(userId),
      ]);

      if (profile) {
        setFullName(profile.full_name);
        setPhone(profile.phone);
        setAvatarUrl(profile.avatar_url);
        setAddress(profile.address);
        setPostalCode(profile.postal_code);
      }

      if (car) {
        setCarId(car.id);
        setBrand(car.brand);
        setModel(car.model);
        setSeats(car.seats);
        setColor(car.color);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  const handleAvatarUpload = async (url: string) => {
    setAvatarUrl(url);

    if (devMode) {
      console.log('[DEV MODE] Avatar uploaded:', url);
      Alert.alert('Avatar updated! (dev mode)');
      return;
    }

    try {
      await updateRecord({
        session,
        table: 'profiles',
        data: { id: userId, avatar_url: url },
      });
      Alert.alert('Avatar updated!');
    } catch (error) {
      showError(error);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      if (devMode) {
        console.log('[DEV MODE] Profile updated:', {
          fullName,
          phone,
          address,
          postalCode,
          brand,
          model,
          seats,
          color,
        });
        Alert.alert('Profile updated! (dev mode)');
        return;
      }

      await updateRecord({
        session,
        table: 'profiles',
        data: {
          id: userId,
          full_name: fullName,
          phone: phone,
          address: address,
          postal_code: postalCode,
        },
      });

      if (brand || model || color || seats) {
        const id = await saveCarData({
          userId,
          carId,
          brand,
          model,
          seats: seats ?? 0,
          color,
        });
        setCarId(id);
      }

      Alert.alert('Profile updated successfully!');
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const profile = [
    {
      isdisabled: false,
      placeholder: 'Full Name',
      value: fullName,
      setter: setFullName,
    },
    { isdisabled: false, placeholder: 'Phone', value: phone, setter: setPhone },
    {
      isdisabled: false,
      placeholder: 'Address',
      value: address,
      setter: setAddress,
    },
    {
      isdisabled: false,
      placeholder: 'Postal Code',
      value: postalCode,
      setter: setPostalCode,
    },
  ];

  const car = [
    {
      isdisabled: false,
      placeholder: 'Car Brand',
      value: brand,
      setter: setBrand,
    },
    { isdisabled: true, placeholder: 'Model', value: model, setter: setModel },
    { isdisabled: true, placeholder: 'Color', value: color, setter: setColor },
    { isdisabled: true, placeholder: 'Seats', value: seats, setter: setSeats },
  ];

  return (
      <SafeAreaView style={{ flex: 1 }}
      >

      <View className="justify-center items-center pb-10">
        <UserAvatar
        size={200}
        url={avatarUrl}
        onUpload={(url: string) => handleAvatarUpload(url)}
        disabled= {false}
        showUploadButton={true}
      />
      </View>

      <View className='mb-20'>
        {profile.map(({ isdisabled, placeholder, value, setter }, i) => (
          <Input key={i} isDisabled={isdisabled}>
            <InputField
              placeholder={placeholder}
              value={value}
              onChangeText={setter}
            />
          </Input>
        ))}
      </View>

      <View className='mb-6 space-y-2'>
        {car.map(({ isdisabled, placeholder, value, setter }, i) => {
          if (placeholder === 'Car Brand' || placeholder === 'Color') {
            return (
                <Select
                    selectedValue={value !== null ? String(value) : null}
                    onValueChange={(v) => setter(v)}
                >
                  <SelectTrigger
                      variant='outline'
                      size='md'
                      className='bg-white rounded-md border border-gray-300 px-3 py-2'
                  >
                    <SelectInput placeholder={placeholder} />
                    <SelectIcon className='mr-3' as={ChevronDownIcon} />
                  </SelectTrigger>

                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      {placeholder === 'Car Brand' ? (
                          <>
                            <SelectItem label='Toyota' value='Toyota' />
                            <SelectItem label='BMW' value='BMW' />
                            <SelectItem label='Tesla' value='Tesla' />
                          </>
                      ) : (
                          <>
                            <SelectItem label='Red' value='Red' />
                            <SelectItem label='Blue' value='Blue' />
                            <SelectItem label='Black' value='Black' />
                          </>
                      )}
                    </SelectContent>
                  </SelectPortal>
                </Select>

            );
          } else {
            return (
                <Input
                    key={i}
                    variant='outline'
                    size='md'
                    isDisabled={isdisabled}
                    className='bg-white rounded-md border border-gray-300 px-3 py-2'
                >
                  <InputField
                      placeholder={placeholder}
                      value={value}
                      onChangeText={setter}
                      editable={!isdisabled}
                      keyboardType={placeholder === 'Seats' ? 'numeric' : 'default'}
                      className='text-black'
                  />
                </Input>
            );
          }
        })}
      </View>

      <View className={"flex-row justify-center"}>
      <View className={"mr-10"}>
        <Button
            size="xl"
            action="positive"

            onPress={updateProfile} disabled={loading}>
          <ButtonText>{loading ? 'Loading ...' : 'Update'}</ButtonText>
        </Button>
      </View>
        <View className={"ml-10"}>
        <Button
            size="xl"
            action="negative"
          onPress={async () => {
            if (devMode) {
              console.log('[DEV MODE] Sign out skipped');
              Alert.alert('Signed out! (dev mode)');
              return;
            }
            const supabase = getSupabaseClient();
            if (!supabase) return;

            await supabase.auth.signOut();
          }}
        >
          <ButtonText>Sign out</ButtonText>
        </Button>
      </View>
      </View>
      </SafeAreaView>
  );
}
