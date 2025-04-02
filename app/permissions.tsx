import { useMicrophonePermissions } from "@speechmatics/expo-two-way-audio";
import { Redirect } from "expo-router";
import { View, Button} from "react-native";

export default function PermissionsPage() {
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  if (micPermission?.status === "granted") {
    return <Redirect href="/"/>
    
  }
  return <View>
    <Button title="Enable microphone permissions" onPress={requestMicPermission}/>
  </View>
}