import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from '../app/screens/Home/index';
import Login from '../app/screens/Login/index';
import Register from '../app/screens/Register';
import EditPost from '../app/screens/post/[editpost]';
import PostDetailScreen from '../app/screens/post/[postId]';
import NewPost from '../app/screens/post/newpost';
const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="screens/Login/index" component={Login} />
      <Screen name="screens/Home/index" component={Home} />
      <Screen name="screens/Register/index" component={Register} />
      <Screen name="screens/post/[postId]" component={PostDetailScreen} />
      <Screen name="screens/post/newpost" component={NewPost} />
      <Screen name="screens/post/[editpost]" component={EditPost} />
    </Navigator>
  );
}