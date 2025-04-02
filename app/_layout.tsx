import "event-target-polyfill";
import { RealtimeTranscriptionProvider } from "@speechmatics/real-time-client-react";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <RealtimeTranscriptionProvider>
      <Slot />
    </RealtimeTranscriptionProvider>
  );
}
