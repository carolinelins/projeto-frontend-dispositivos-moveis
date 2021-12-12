import React from 'react';
import { NativeBaseProvider, Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClientProvider } from 'react-query'
import { queryClient } from './common'

import List from './components/ListShoppingList'
import Add from './components/AddShoppingList'
import Edit from './components/EditShoppingList'

const Stacke = createNativeStackNavigator();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <NativeBaseProvider>
          <Stacke.Navigator initialRouteName='Lista de Compras'>
            <Stacke.Screen name="Lista de compras" component={List} />
            <Stacke.Screen name="Adicionar produto" component={Add} />
            <Stacke.Screen name="Editar produto" component={Edit} />
          </Stacke.Navigator>
        </NativeBaseProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}