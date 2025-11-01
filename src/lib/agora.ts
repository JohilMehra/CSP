// src/lib/agora.ts
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  UID
} from "agora-rtc-sdk-ng";

export interface Participant {
  uid: UID;
  name?: string;
  videoTrack?: ILocalVideoTrack | IRemoteVideoTrack;
  audioTrack?: ILocalAudioTrack | IRemoteAudioTrack;
  isLocal?: boolean;
  isVideoOn?: boolean;
  isAudioOn?: boolean;
}

let client: IAgoraRTCClient | null = null;
let localAudioTrack: ILocalAudioTrack | null = null;
let localVideoTrack: ILocalVideoTrack | null = null;

export function getClient(): IAgoraRTCClient {
  if (!client) {
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  }
  return client;
}

export async function joinChannel({
  appId,
  channel,
  token,
  uid,
}: {
  appId: string;
  channel: string;
  token?: string | null;
  uid?: string | number | null;
}): Promise<UID> {
  const agoraClient = getClient();

  const assignedUid = await agoraClient.join(appId, channel, token || null, uid || null);

  // create local audio and video tracks (prompts for permission)
  [localAudioTrack, localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

  await agoraClient.publish([localAudioTrack, localVideoTrack]);

  console.log("Published local tracks");

  return assignedUid;
}

export function getLocalTracks() {
  return { localAudioTrack, localVideoTrack };
}

export async function leaveChannel(): Promise<void> {
  const agoraClient = getClient();
  try {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
      localAudioTrack = null;
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
      localVideoTrack = null;
    }
    await agoraClient.leave();
  } finally {
    console.log("Left Agora channel");
    client = null;
  }
}
