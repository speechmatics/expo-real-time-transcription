import "event-target-polyfill";
import { View, Button, StyleSheet, Text, ScrollView } from "react-native";
import {
  useRealtimeEventListener,
  useRealtimeTranscription,
} from "@speechmatics/real-time-client-react";
import {
  useExpoTwoWayAudioEventListener,
  initialize as initializeAudio,
  useMicrophonePermissions,
  toggleRecording,
} from "@speechmatics/expo-two-way-audio";
import { useCallback, useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { getJWT } from "@/lib/auth";

export default function Home() {
  const [audioInitialized, setAudioInitialized] = useState(false);
  useEffect(() => {
    (async () => {
      await initializeAudio();
      setAudioInitialized(true);
    })();
  }, []);

  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const {
    sessionId,
    socketState,
    sendAudio,
    startTranscription,
    stopTranscription,
  } = useRealtimeTranscription();

  useExpoTwoWayAudioEventListener("onMicrophoneData", (event) => {
    console.log("onMicrophoneData", event.data);
    // TODO fix type signature in SDK
    sendAudio(event.data.buffer);
  });

  const startSession = useCallback(async () => {
    const jwt = await getJWT();
    await startTranscription(jwt, {
      transcription_config: {
        language: "en",
        operating_point: "enhanced",
        max_delay: 2,
      },
      audio_format: {
        type: "raw",
        encoding: "pcm_s16le",
        sample_rate: 16_000,
      },
    });
    toggleRecording(true);
  }, [startTranscription]);

  const stopSession = useCallback(async () => {
    toggleRecording(false);
    await stopTranscription();
  }, []);

  const [transcript, setTranscript] = useState("");
  useRealtimeEventListener("receiveMessage", ({ data }) => {
    if (data.message === "AddTranscript") {
      setTranscript((prev) => prev + data.metadata.transcript);
    }
  });

  if (micPermission?.status === "undetermined") {
    return <Redirect href="/permissions" />;
  }

  if (!audioInitialized) {
    return (
      <View style={styles.container}>
        <Button title="Initializing audio..." disabled />
      </View>
    );
  }
  console.log(socketState);

  return (
    <View style={styles.container}>
      {!!socketState && <Text>{"Socket state: " + socketState}</Text>}
      <ScrollView style={{flexGrow: 1, width: "100%" }}>
        <Text style={styles.text}>{transcript}</Text>
      </ScrollView>
      {(!socketState || socketState === "closed") && (
        <Button title="Start transcription" onPress={startSession} />
      )}
      {socketState === "open" && (
          <Button title="Stop transcription" onPress={stopSession} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
    height: "100%",
    margin: 10
  },
  text: {
    fontSize: 20,
  },
});
