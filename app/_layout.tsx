import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: '강아지 입양 준비 체크리스트',
            headerShown: false,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
