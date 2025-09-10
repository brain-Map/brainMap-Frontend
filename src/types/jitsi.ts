// Jitsi Meet External API TypeScript declarations
export interface JitsiMeetConfig {
  roomName: string;
  width?: string | number;
  height?: string | number;
  parentNode?: HTMLElement | null;
  userInfo?: {
    displayName?: string;
    email?: string;
  };
  configOverwrite?: {
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
    enableWelcomePage?: boolean;
    enableClosePage?: boolean;
    prejoinPageEnabled?: boolean;
    disableDeepLinking?: boolean;
  };
  interfaceConfigOverwrite?: {
    TOOLBAR_BUTTONS?: string[];
    SHOW_JITSI_WATERMARK?: boolean;
    SHOW_WATERMARK_FOR_GUESTS?: boolean;
  };
}

export interface JitsiMeetAPI {
  dispose(): void;
  addListener(event: string, listener: (data?: any) => void): void;
  removeListener(event: string, listener: (data?: any) => void): void;
  executeCommand(command: string, ...args: any[]): void;
  getNumberOfParticipants(): number;
  getAvatarURL(participantId: string): string;
  getDisplayName(participantId: string): string;
  getEmail(participantId: string): string;
  isVideoMuted(): Promise<boolean>;
  isAudioMuted(): Promise<boolean>;
}
