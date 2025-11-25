import { useState } from 'react';
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type Post = {
    id: string;
    title: string;
    subtitle?: string;
    content: string;
    createdAt: string;
};

export default function NewPost({ navigation }: { navigation?: any }) {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);

    const validate = () => {
        if (!title.trim()) {
            Alert.alert('Validation', 'Title is required');
            return false;
        }
        if (!content.trim()) {
            Alert.alert('Validation', 'Content is required');
            return false;
        }
        return true;
    };

    const savePost = async () => {
        if (!validate() || saving) return;

        setSaving(true);
        const newPost: Post = {
            id: `${Date.now()}`,
            title: title.trim(),
            subtitle: subtitle.trim(),
            content: content.trim(),
            createdAt: new Date().toISOString(),
        };

        try {
            // Simulação de salvamento
            Alert.alert('Success', 'Post saved');
            if (navigation && navigation.goBack) navigation.push('/');
            setTitle('');
            setSubtitle('');
            setContent('');
        } catch (e) {
            console.error('Failed to save post', e);
            Alert.alert('Error', 'Could not save post');
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.heading}>New Post</Text>

                <Text style={styles.label}>Title</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter title"
                    style={styles.input}
                    returnKeyType="next"
                />

                <Text style={styles.label}>Subtitle (optional)</Text>
                <TextInput
                    value={subtitle}
                    onChangeText={setSubtitle}
                    placeholder="Enter subtitle"
                    style={styles.input}
                    returnKeyType="next"
                />

                <Text style={styles.label}>Content</Text>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="Write your post..."
                    style={[styles.input, styles.contentInput]}
                    multiline
                    textAlignVertical="top"
                />
                <Text style={styles.counter}>{content.length} characters</Text>

                <View style={styles.button}>
                    <Button title={saving ? 'Saving...' : 'Save Post'} onPress={savePost} disabled={saving} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 12,
    },
    label: {
        marginTop: 12,
        marginBottom: 6,
        fontSize: 14,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    contentInput: {
        minHeight: 160,
        paddingTop: 12,
    },
    counter: {
        alignSelf: 'flex-end',
        marginTop: 6,
        color: '#666',
        fontSize: 12,
    },
    button: {
        marginTop: 20,
    },
});