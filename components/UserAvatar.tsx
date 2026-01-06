import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { getSupabaseClient } from '@/context/supabase';
import { Avatar, AvatarFallbackText, AvatarImage } from './ui/avatar';
import { Button, ButtonText } from './ui/button';

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function UserAvatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };
  const devMode = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
  const supabase = !devMode ? getSupabaseClient() : null;

  useEffect(() => {
    if (!devMode && url) {
      if (url.startsWith('http')) {
        setAvatarUrl(url);
      } else {
        downloadImage(url);
      }
    } else if (devMode && url) {
      setAvatarUrl(url);
    }
  }, [url, devMode]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase!.storage
        .from('avatars')
        .download(path);
      if (error) throw error;

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.');
        return;
      }

      const image = result.assets[0];
      if (!image.uri) throw new Error('No image URI!');

      if (devMode) {
        console.log('[DEV MODE] Mock upload:', image.uri);
        setAvatarUrl(image.uri);
        setTimeout(() => {
          onUpload(image.uri);
          setUploading(false);
          Alert.alert('Mock upload complete!');
        }, 500);
        return;
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer(),
      );
      const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase!.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      const publicUrl = publicUrlData.publicUrl;
      setAvatarUrl(publicUrl);
      onUpload(publicUrl);
      Alert.alert('Upload complete!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View>
      <Avatar size='md' style={avatarSize}>
        <AvatarFallbackText>Avatar</AvatarFallbackText>
        <AvatarImage source={avatarUrl ? { uri: avatarUrl } : undefined} />
      </Avatar>

      <View>
        <Button onPress={uploadAvatar} disabled={uploading}>
          <ButtonText>{uploading ? 'Uploading ...' : 'Upload'}</ButtonText>
        </Button>
      </View>
    </View>
  );
}