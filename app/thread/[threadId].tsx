import { useLocalSearchParams } from 'expo-router';
import { useState, useContext } from 'react';
import { Button, TextInput, FlatList, StyleSheet, View, Text } from 'react-native';
import { GlobalContext, State, EmailMessage } from '../state';

export default function Page() {
    const { threadId } = useLocalSearchParams();
    const { sendQueue, actions, user, threads } = useContext(GlobalContext);
    const { subject, messages, recipients } = threads
    .find(t => t.id === threadId) ?? throw new Error(`thread with id {threadId} doesn't exist`);
    const [newMessage, setMessage] = useState<string | undefined>();

    const allMessages = messages.concat(sendQueue.map(s => ({...s, id: `unsent-${s.ts}`}))).sort(sortByDate);

    return (
        <View style={styles.container}>
            <View style={styles.subjectBox}>
                <Text>{subject}</Text>
                <Text>{recipients.join(', ')}</Text>
            </View>
            <FlatList
                inverted={true}
                style={styles.messagesBox}
                data={allMessages.map((m: EmailMessage) => ({...m, title: m.from, key: m.id }))}
                renderItem={({ item, index, separators }) => (
                    <View
                        style={item.from === user.email ? styles.meMessage : styles.youMessage}>
                        <Text>{item.from}</Text>
                        <Text>{item.ts.toString()}</Text>
                        <Text>{item.sendState.status}</Text>
                        <Text>{item.content}</Text>
                    </View>
                )}
            />
            <View style={styles.inputBox}>
                <Button
                    disabled={!newMessage}
                    onPress={() => {
                        const newEmail = {
                            threadId,
                            from: user.email,
                            ts: new Date(),
                            content: newMessage,
                            sendState: { status: 'sending' }
                        };
                        actions.addToSendQueue(newEmail);
                        setMessage(undefined);
                    }}
                    title="Send" />
                <TextInput onChangeText={setMessage} style={styles.input} value={newMessage}/>
            </View>
        </View>
    );
}

function sortByDate(a: EmailMessage, b: EmailMessage): number {
    const ams = a.ts.getMilliseconds();
    const bms = b.ts.getMilliseconds();

    return (ams - bms) * -1;
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
