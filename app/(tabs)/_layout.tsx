import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { Tabs, Slot, Redirect } from 'expo-router';
import dashboardIcon from '../../constants/dashboard.png';
import friendsIcon from '../../constants/friends.png';
import allExpensesIcon from '../../constants/expenseHistory.png';


const TabIcon = ({ icon, color, name, focused}) => {
    return (
        <View>
            <Image 
                source={icon}
                resizeMode="contain"
                tintColor={color}
                style={[
                    styles.icon,
                    { tintColor: color },
                ]}
            />            
        </View>
    )
}

const TabsLayout = () => {
    return (
        <>        
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#FFA001',
                    tabBarInactiveTintColor: '#CDCDE0',
                    tabBarStyle: {
                        backgroundColor: '#161622'
                    }
                }}
            >
                <Tabs.Screen 
                    name='dashboard'
                    options={{
                        title: 'Dashboard',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={dashboardIcon}
                                color={color}
                                name="Dashboard"
                                focused={focused}
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name='friends'
                    options={{
                        title: 'Friends',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={friendsIcon}
                                color={color}
                                name="Friends"
                                focused={focused}
                            />
                        )
                    }}
                />
                <Tabs.Screen 
                    name='allExpenses'
                    options={{
                        title: 'AllExpenses',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={allExpensesIcon}
                                color={color}
                                name="AllExpenses"
                                focused={focused}
                            />
                        )
                    }}
                />
            </Tabs>            
        </>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});

export default TabsLayout;