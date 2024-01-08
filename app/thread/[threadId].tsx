import { useLocalSearchParams } from 'expo-router';
import { Buffer } from "buffer";
import { useEffect, useState, useContext } from 'react';
import { Button, TextInput, FlatList, StyleSheet, View, Text } from 'react-native';
import { GmailMessageV1, GmailThreadV1 } from '../gapiClient/types';
import { SendState, GlobalContext, State, EmailMessage } from '../state';
import { FROM_EMAILS, getFromQueryParam } from '../util';

export default function Page() {
    const { threadId } = useLocalSearchParams();
    const state = useContext(GlobalContext);
    const threadMeta = state.threads.find(t => t.id === threadId) ?? throw new Error(`thread with id {threadId} doesn't exist`);
    const [thread, setThread] = useState<GmailThreadV1 | undefined>();
    const [newMessage, setMessage] = useState<string | undefined>();

    useEffect(() => {
        if (state.user && threadMeta) {
            // get messages for thread
            state.actions.gapi.get(
                `/gmail/v1/users/${state.user.googleId}/threads/${threadMeta.id}?q="${getFromQueryParam(FROM_EMAILS[0])}"`
            ).then((t: GmailThreadV1) => {
                setThread(t);
            }).catch((e: any) => {
                console.error('Failed to get gmail thread content: ', e);
            });

        }
    }, [state, state.user, threadMeta]);

    //const allMessages = messages.concat(sendQueue.map(s => ({...s, id: `unsent-${s.ts}`}))).sort(sortByDate);

    const allMessages = (thread?.messages || []).map(m => ({
        threadId: m.threadId,
        id: m.id,
        from: getHeaderValue(m, "From") || "unknown",
        ts: new Date(parseInt(m.internalDate)),
        content: getMessageContent(m),
        sendState: { status: 'sent' } as SendState,
    }));

    const subject = getHeaderValue(thread?.messages[0], "Subject");

    return (
        <View style={styles.container}>
            <View style={styles.subjectBox}>
                <Text>{subject}</Text>
            </View>
            <FlatList
                style={styles.messagesBox}
                data={allMessages.map((m: EmailMessage) => ({...m, title: m.from, key: m.id }))}
                renderItem={({ item, index, separators }) => (
                    <View
                        style={item.from.includes(state.user?.email || 'asdlfkjasdfijekikkk') ? styles.meMessage : styles.youMessage}>
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
                        const date = new Date();
                        const newEmail = {
                            threadId,
                            id: `unsent-${threadId}-${date}`,
                            from: state.user?.email,
                            ts: date,
                            content: newMessage,
                            sendState: { status: 'sending' }
                        };
                        state.actions.addToSendQueue(newEmail);
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

function getHeaderValue(message?: GmailMessageV1, name: string): string | undefined {
    if (message) {
        return message.payload.headers.find(h => h.name === name)?.value;
    }
    return;
}

function getMessageContent(message: GmailMessageV1): string {
    const contents = message.payload.parts.map(p => {
        if (p.body.data) {
            const r = Buffer.from(p.body.data, "base64").toString('utf-8');
            return r;
        }
        return '';
    });

    if (contents.length > 0) {
        return contents[0];
    }
    return '';
}

const sharedMessageStyle = {
    display: 'flex',
    borderColor: 'darkgray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 10,
    padding: 5,
    maxWidth: '75%'
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
