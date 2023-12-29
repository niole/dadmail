import { useLocalSearchParams } from 'expo-router';
import { useContext } from 'react';
import { Button, TextInput, FlatList, StyleSheet, View, Text } from 'react-native';
import { GlobalContext, State, EmailMessage } from '../state';

export default function Page() {
    const { threadId } = useLocalSearchParams();
    const { user, threads } = useContext(GlobalContext);
    const { subject, messages, recipients } = threads
        .find(t => t.id === threadId) ?? throw new Error(`thread with id {threadId} doesn't exist`);

    return (
        <View style={styles.container}>
            <View style={styles.subjectBox}>
                <Text>{subject}</Text>
                <Text>{recipients.join(', ')}</Text>
            </View>
            <FlatList
                inverted={true}
                style={styles.messagesBox}
                data={messages.map((m: EmailMessage) => ({...m, title: m.from, key: m.id }))}
                renderItem={({ item, index, separators }) => (
                    <View
                        style={item.from === user.email ? styles.meMessage : styles.youMessage}>
                        <Text>{item.from}</Text>
                        <Text>{item.ts.toString()}</Text>
                        <Text>{item.content}</Text>
                    </View>
                )}
            />
            <View style={styles.inputBox}>
                <Button onPress={() => console.log('press')} title="Send" />
                <TextInput style={styles.input} />
            </View>
        </View>
    );
}

const sharedMessageStyle = {
    display: 'flex',
    marginBottom: 10,
};
const styles = StyleSheet.create({
    container: {
        height: '100%',
        display: 'flex',
    },
    subjectBox: {
        display: 'flex',
        flexGrow: 1,
    },
    messagesBox: {
        display: 'flex',
        flexGrow: 7,
        backgroundColor: 'grey',
    },
    input: {
        textAlign: 'right',
        display: 'flex',
        flexGrow:1,
        borderWidth: 1,
        borderColor: 'black',
    },
    inputBox: {
        display: 'flex',
        flexGrow: 1,
    },
    meMessage: {
        alignSelf: 'flex-end',
        ...sharedMessageStyle
    },
    youMessage: {
        alignSelf: 'flex-start',
        ...sharedMessageStyle
    }
});
