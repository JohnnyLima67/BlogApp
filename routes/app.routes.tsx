import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Home from '../app/screens/Home/index';
import Login from '../app/screens/Login/index';
import EditPost from '../app/screens/post/[editpost]';
import PostDetailScreen from '../app/screens/post/[postId]';
import NewPost from '../app/screens/post/newpost';
import Professors from '../app/screens/Professors/index';
import Register from '../app/screens/Register';
import RegisterProfessor from '../app/screens/RegisterProfessor/index';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Stack para posts dentro da aba Feed
 */
function PostStack({ role }: { role: string | null }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="screens/Home/index"
        component={Home}
        initialParams={{ role }}
      />
      <Stack.Screen name="screens/post/[postId]" component={PostDetailScreen} />
      <Stack.Screen name="screens/post/newpost" component={NewPost} />
      <Stack.Screen name="screens/post/[editpost]" component={EditPost} />
    </Stack.Navigator>
  );
}

/**
 * Stack para Professores
 */
function ProfessorsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Professores" component={Professors} />
      <Stack.Screen name="RegisterProfessor" component={RegisterProfessor} />
    </Stack.Navigator>
  );
}

/**
 * Tabs principais (aparecem só depois do login)
 */
function MainTabs({ role }: { role: string | null }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Feed') {
            iconName = 'home';
          } else if (route.name === 'Professores') {
            iconName = 'person';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Passa role para PostStack */}
      <Tab.Screen name="Feed">
        {() => <PostStack role={role} />}
      </Tab.Screen>

      {/* ✅ Só mostra a tab Professores se role === "professor" */}
      {role === "professor" && (
        <Tab.Screen name="Professores" component={ProfessorsStack} />
      )}
    </Tab.Navigator>
  );
}

/**
 * Fluxo de autenticação
 */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screens/Login/index" component={Login} />
      <Stack.Screen name="screens/Register/index" component={Register} />
    </Stack.Navigator>
  );
}

/**
 * Decide qual fluxo mostrar
 */
export function AppRoutes({ isLoggedIn, role }: { isLoggedIn: boolean; role: string | null }) {
  return isLoggedIn ? <MainTabs role={role} /> : <AuthStack />;
}