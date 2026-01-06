import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, Text, View, Modal } from 'react-native';

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

export default function DatePickerField({ value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_: any, date?: Date) => {
    if (!date) {
      setShowPicker(false);
      return;
    }

    onChange(date);

    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  };

  return (
    <View>
      <Pressable
        onPress={() => setShowPicker(true)}
        className="bg-white border border-gray-300 rounded-xl p-4 flex-row items-center justify-between my-4"
      >
        <View className="flex-row items-center">
          <Text className="text-lg mr-3">📅</Text>
          <Text className="text-lg text-gray-800">
            {value.toLocaleDateString('nl-NL', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
        <Text className="text-blue-600 font-semibold">Wijzigen</Text>
      </Pressable>

      {/* iOS modal */}
      {Platform.OS === 'ios' && showPicker && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6">
              <DateTimePicker
                value={value}
                mode="date"
                display="spinner"
                onChange={handleChange}
                locale="nl-NL"
              />
              <Pressable
                onPress={() => setShowPicker(false)}
                className="mt-4 bg-blue-500 rounded-xl py-4"
              >
                <Text className="text-center text-white font-medium">
                  Bevestigen
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* Android */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
          locale="nl-NL"
        />
      )}
    </View>
  );
}
