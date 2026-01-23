import { SearchIcon } from 'lucide-react-native';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { ListRenderItem } from 'react-native';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from './ui/card';
import { Input, InputField, InputIcon, InputSlot } from './ui/input';

interface PhotonFeature {
  properties: {
    osm_id?: number;
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    [key: string]: any;
  };
}

interface PhotonAPIResponse {
  features: PhotonFeature[];
}

interface AutoCompleteLocationProps {
  placeholder?: string;
  className?: string;
  minChars?: number;
  limit?: number;
  onSelect: (feature: PhotonFeature) => void;
  value: string;
}

export const AutoCompleteLocation: React.FC<AutoCompleteLocationProps> = ({
  placeholder = 'Voer het volledige adress in',
  minChars = 2,
  limit = 6,
  onSelect,
  value,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PhotonFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const cacheRef = useRef<Map<string, PhotonFeature[]>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const skipNextFetchRef = useRef(false);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }

    if (query.length < minChars) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      abortRef.current?.abort();
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  async function fetchSuggestions(q: string) {
    const key = `${q}|${limit}`;
    if (cacheRef.current.has(key)) {
      setResults(cacheRef.current.get(key)!);
      setOpen(true);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        q,
        limit: String(limit),
        lang: 'en',
      });
      const url = `https://photon.komoot.io/api/?${params.toString()}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: PhotonAPIResponse = await res.json();
      const features = data.features || [];

      cacheRef.current.set(key, features);
      setResults(features);
      setOpen(true);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Photon fetch error:', err);
        setResults([]);
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(item: PhotonFeature) {
    const p = item.properties;
    const name =
      p.name ||
      p['name:nl'] ||
      p.display_name ||
      p.weergavenaam ||
      [p.street, p.housenumber].filter(Boolean).join(' ') ||
      p.street ||
      p.city ||
      '';
    skipNextFetchRef.current = true;
    setQuery(name);
    setOpen(false);
    onSelect(p);
  }

  const renderItem: ListRenderItem<PhotonFeature> = ({ item }) => {
    const p = item.properties;

    const name =
      p.name ||
      p['name:nl'] ||
      p.display_name ||
      p.weergavenaam ||
      [p.street, p.housenumber].filter(Boolean).join(' ') ||
      p.street ||
      p.city ||
      'Naamloos';

    const city =
      p.city || p['city:nl'] || p.town || p['town:nl'] || p.municipality || '';
    const state = p.state || p['state:nl'] || p.province || p.region || '';
    const country = p.country || p['country:nl'] || p.land || '';

    const context = [city, state, country].filter(Boolean).join(', ');

    return (
      <TouchableOpacity
        className='px-3 py-2 border-b border-gray-200'
        onPress={() => handleSelect(item)}
      >
        <Text className='text-base font-medium text-gray-800'>{name}</Text>
        {context.length > 0 && (
          <Text className='text-xs text-gray-500'>{context}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="w-full ">
      <Input className="w-full bg-white h-12 rounded-xl" onFocus={() => results.length > 0 && setOpen(true)}>
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          placeholder={placeholder}
          value={query}
          onChangeText={setQuery}
        />
      </Input>

      {loading && (
        <ActivityIndicator className="absolute right-3 top-3" size="small" />
      )}

      {open && results.length > 0 && (
        <View className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-gray-200 bg-white max-h-64 z-50 p-6">
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={results}
            keyExtractor={(item, index) =>
              `${item.properties.osm_id ?? index}-${index}`
            }
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
};
