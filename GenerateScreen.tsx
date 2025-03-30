import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

const aspects = ['1:1', '16:9', '9:16', '4:5', '5:4'] as const;

export default function GenerateScreen() {
  const [prompt, setPrompt] = useState('');
  const [selectedAspect, setSelectedAspect] = useState<typeof aspects[number]>('1:1');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);  const [recentImages, setRecentImages] = useState<string[]>([]);
  const [savedImages, setSavedImages] = useState<string[]>([]);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://api.a0.dev/assets/image?text=${encodedPrompt}&aspect=${selectedAspect}`;
      setGeneratedImage(imageUrl);
      setRecentImages(prev => [imageUrl, ...prev].slice(0, 10));
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.title}>Qammar Vision</Text>
                <Text style={styles.subtitle}>Create amazing AI art with text</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="create" size={24} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Describe the image you want to create..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={prompt}
              onChangeText={setPrompt}
              multiline
            />
          </View>

          <View style={styles.aspectContainer}>
            <Text style={styles.aspectTitle}>Choose Aspect Ratio:</Text>
            <View style={styles.aspectButtons}>
              {aspects.map((aspect) => (
                <TouchableOpacity
                  key={aspect}
                  style={[
                    styles.aspectButton,
                    selectedAspect === aspect && styles.aspectButtonSelected,
                  ]}
                  onPress={() => setSelectedAspect(aspect)}
                >
                  <Text style={[
                    styles.aspectButtonText,
                    selectedAspect === aspect && styles.aspectButtonTextSelected,
                  ]}>
                    {aspect}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.generateButton, isLoading && styles.buttonDisabled]}
            onPress={generateImage}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Image</Text>
            )}
          </TouchableOpacity>          {generatedImage && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Generated Image:</Text>
              <Image
                source={{ uri: generatedImage }}
                style={styles.generatedImage}
                resizeMode="contain"
              />              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                  onPress={() => {
                    setSavedImages(prev => [...prev, generatedImage]);
                    toast.success('Image saved to gallery!');
                  }}
                >
                  <MaterialIcons name="save-alt" size={24} color="#fff" />
                  <Text style={styles.actionButtonText}>Save</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                  onPress={async () => {
                    try {
                      await Share.share({
                        message: 'Check out this AI-generated image from Qammar Vision!',
                        url: generatedImage
                      });
                    } catch (error) {
                      toast.error('Failed to share image');
                    }
                  }}
                >
                  <MaterialIcons name="share" size={24} color="#fff" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#FF5722' }]}
                  onPress={() => navigation.navigate('Login')}
                >
                  <MaterialIcons name="arrow-back" size={24} color="#fff" />
                  <Text style={styles.actionButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {recentImages.length > 0 && (
            <View style={styles.recentContainer}>
              <Text style={styles.recentTitle}>Recent Generations:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recentImages.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img }}
                    style={styles.recentImage}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    marginTop: 4,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  aspectContainer: {
    marginBottom: 20,
  },
  aspectTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  aspectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  aspectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  aspectButtonSelected: {
    backgroundColor: '#FF6B6B',
  },
  aspectButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  aspectButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginBottom: 20,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  generatedImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  recentContainer: {
    marginBottom: 20,
  },
  recentTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
});