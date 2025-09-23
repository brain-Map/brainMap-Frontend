// "use client";

// import { useEffect, useRef, useState } from "react";

// // Jitsi Meet types
// interface JitsiMeetAPI {
//   dispose(): void;
//   executeCommand(command: string, ...args: any[]): void;
//   addListener(event: string, handler: Function): void;
//   removeListener(event: string, handler: Function): void;
//   isAudioMuted(): Promise<boolean>;
//   isVideoMuted(): Promise<boolean>;
//   getParticipantsInfo(): any[];
// }

// interface JitsiMeetExternalAPI {
//   new (domain: string, options: JitsiMeetConfig): JitsiMeetAPI;
// }

// interface JitsiMeetConfig {
//   roomName: string;
//   width?: string | number;
//   height?: string | number;
//   parentNode?: HTMLElement | null;
//   configOverwrite?: {
//     prejoinPageEnabled?: boolean;
//     disableInviteFunctions?: boolean;
//     enableWelcomePage?: boolean;
//     enableClosePage?: boolean;
//     disableDeepLinking?: boolean;
//     startWithAudioMuted?: boolean;
//     startWithVideoMuted?: boolean;
//     enableEmailInStats?: boolean;
//     enableDisplayNameInStats?: boolean;
//     enableTalkWhileMuted?: boolean;
//     disableModeratorIndicator?: boolean;
//     startScreenSharing?: boolean;
//     enableUserRolesBasedOnToken?: boolean;
//     [key: string]: any;
//   };
//   interfaceConfigOverwrite?: {
//     TOOLBAR_BUTTONS?: string[];
//     SETTINGS_SECTIONS?: string[];
//     SHOW_JITSI_WATERMARK?: boolean;
//     SHOW_WATERMARK_FOR_GUESTS?: boolean;
//     SHOW_BRAND_WATERMARK?: boolean;
//     BRAND_WATERMARK_LINK?: string;
//     SHOW_POWERED_BY?: boolean;
//     DISABLE_VIDEO_BACKGROUND?: boolean;
//     DISABLE_FOCUS_INDICATOR?: boolean;
//     DISABLE_DOMINANT_SPEAKER_INDICATOR?: boolean;
//     DISABLE_TRANSCRIPTION_SUBTITLES?: boolean;
//     DISABLE_RINGING?: boolean;
//     AUDIO_LEVEL_PRIMARY_COLOR?: string;
//     AUDIO_LEVEL_SECONDARY_COLOR?: string;
//     POLICY_LOGO?: string;
//     LOCAL_THUMBNAIL_RATIO?: number;
//     REMOTE_THUMBNAIL_RATIO?: number;
//     LIVE_STREAMING_HELP_LINK?: string;
//     MOBILE_APP_PROMO?: boolean;
//     [key: string]: any;
//   };
//   userInfo?: {
//     displayName?: string;
//     email?: string;
//     avatarURL?: string;
//   };
//   jwt?: string;
//   onload?: Function;
//   invitees?: Array<{
//     id: string;
//     avatar: string;
//     name: string;
//     title?: string;
//   }>;
//   devices?: {
//     audioInput?: string;
//     audioOutput?: string;
//     videoInput?: string;
//   };
//   userAttributes?: {
//     [key: string]: string;
//   };
// }

// // Extend Window interface to include JitsiMeetExternalAPI
// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: JitsiMeetExternalAPI;
//   }
// }

// interface JitsiMeetingProps {
//   roomName: string;
//   user: {
//     name: string;
//     email?: string;
//     avatar?: string;
//     id?: string;
//   };
//   onMeetingEnded?: () => void;
//   onParticipantJoined?: (participant: any) => void;
//   onParticipantLeft?: (participant: any) => void;
//   domain?: string;
//   jwt?: string;
//   className?: string;
//   style?: React.CSSProperties;
//   configOverwrite?: JitsiMeetConfig['configOverwrite'];
//   interfaceConfigOverwrite?: JitsiMeetConfig['interfaceConfigOverwrite'];
// }

// export default function JitsiMeeting({
//   roomName,
//   user,
//   onMeetingEnded,
//   onParticipantJoined,
//   onParticipantLeft,
//   domain = "meet.jit.si",
//   jwt,
//   className,
//   style,
//   configOverwrite = {},
//   interfaceConfigOverwrite = {}
// }: JitsiMeetingProps) {
//   const jitsiContainerRef = useRef<HTMLDivElement>(null);
//   const jitsiApiRef = useRef<JitsiMeetAPI | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const scriptLoadedRef = useRef(false);

//   // Default configuration
//   const defaultConfig: JitsiMeetConfig['configOverwrite'] = {
//     prejoinPageEnabled: false,
//     disableInviteFunctions: false,
//     enableWelcomePage: false,
//     enableClosePage: false,
//     disableDeepLinking: true,
//     startWithAudioMuted: false,
//     startWithVideoMuted: false,
//     enableEmailInStats: false,
//     enableDisplayNameInStats: false,
//     enableTalkWhileMuted: true,
//     disableModeratorIndicator: false,
//     startScreenSharing: false,
//     enableUserRolesBasedOnToken: false,
//     ...configOverwrite
//   };

//   const defaultInterfaceConfig: JitsiMeetConfig['interfaceConfigOverwrite'] = {
//     TOOLBAR_BUTTONS: [
//       'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
//       'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
//       'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
//       'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
//       'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
//       'security'
//     ],
//     SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
//     SHOW_JITSI_WATERMARK: false,
//     SHOW_WATERMARK_FOR_GUESTS: false,
//     SHOW_BRAND_WATERMARK: false,
//     SHOW_POWERED_BY: false,
//     DISABLE_VIDEO_BACKGROUND: false,
//     DISABLE_FOCUS_INDICATOR: false,
//     DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
//     DISABLE_TRANSCRIPTION_SUBTITLES: false,
//     DISABLE_RINGING: false,
//     MOBILE_APP_PROMO: false,
//     ...interfaceConfigOverwrite
//   };

//   // Load Jitsi Meet External API script
//   const loadJitsiScript = (): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       if (window.JitsiMeetExternalAPI || scriptLoadedRef.current) {
//         resolve();
//         return;
//       }

//       const script = document.createElement("script");
//       script.src = `https://${domain}/external_api.js`;
//       script.async = true;
//       script.onload = () => {
//         scriptLoadedRef.current = true;
//         resolve();
//       };
//       script.onerror = () => {
//         setError("Failed to load Jitsi Meet API");
//         reject(new Error("Failed to load Jitsi Meet API"));
//       };
//       document.head.appendChild(script);
//     });
//   };

//   // Initialize Jitsi Meet
//   const initializeJitsi = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       // Ensure script is loaded
//       await loadJitsiScript();

//       // Clean up existing instance
//       if (jitsiApiRef.current) {
//         jitsiApiRef.current.dispose();
//         jitsiApiRef.current = null;
//       }

//       // Validate required parameters
//       if (!roomName || !user?.name) {
//         throw new Error("Room name and user name are required");
//       }

//       const options: JitsiMeetConfig = {
//         roomName: roomName.replace(/[^a-zA-Z0-9]/g, ''), // Clean room name
//         width: "100%",
//         height: "100%",
//         parentNode: jitsiContainerRef.current,
//         configOverwrite: defaultConfig,
//         interfaceConfigOverwrite: defaultInterfaceConfig,
//         userInfo: {
//           displayName: user.name,
//           email: user.email,
//           avatarURL: user.avatar
//         }
//       };

//       // Add JWT if provided
//       if (jwt) {
//         options.jwt = jwt;
//       }

//       // Initialize Jitsi Meet API
//       const api = new window.JitsiMeetExternalAPI(domain, options);
//       jitsiApiRef.current = api;

//       // Set up event listeners
//       api.addListener('videoConferenceJoined', (event: any) => {
//         console.log('Conference joined:', event);
//         setIsLoading(false);
//       });

//       api.addListener('videoConferenceLeft', (event: any) => {
//         console.log('Conference left:', event);
//         onMeetingEnded?.();
//       });

//       api.addListener('participantJoined', (event: any) => {
//         console.log('Participant joined:', event);
//         onParticipantJoined?.(event);
//       });

//       api.addListener('participantLeft', (event: any) => {
//         console.log('Participant left:', event);
//         onParticipantLeft?.(event);
//       });

//       api.addListener('readyToClose', () => {
//         console.log('Ready to close');
//         onMeetingEnded?.();
//       });

//       api.addListener('errorOccurred', (event: any) => {
//         console.error('Jitsi error:', event);
//         setError(event.error?.message || 'An error occurred during the meeting');
//       });

//       // Handle API load errors
//       const errorTimeout = setTimeout(() => {
//         if (isLoading) {
//           setError('Meeting failed to load. Please try again.');
//           setIsLoading(false);
//         }
//       }, 15000); // 15 second timeout

//       api.addListener('videoConferenceJoined', () => {
//         clearTimeout(errorTimeout);
//       });

//     } catch (err) {
//       console.error('Failed to initialize Jitsi:', err);
//       setError(err instanceof Error ? err.message : 'Failed to initialize meeting');
//       setIsLoading(false);
//     }
//   };

//   // Cleanup function
//   const cleanup = () => {
//     if (jitsiApiRef.current) {
//       try {
//         jitsiApiRef.current.dispose();
//         jitsiApiRef.current = null;
//       } catch (err) {
//         console.warn('Error disposing Jitsi API:', err);
//       }
//     }
//   };

//   useEffect(() => {
//     initializeJitsi();

//     // Cleanup on unmount
//     return cleanup;
//   }, [roomName, user.name, user.email, domain, jwt]);

//   // Handle window unload
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       cleanup();
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       cleanup();
//     };
//   }, []);

//   const containerStyle: React.CSSProperties = {
//     width: "100%",
//     height: "600px",
//     position: "relative",
//     backgroundColor: "#1a1a1a",
//     borderRadius: "8px",
//     overflow: "hidden",
//     ...style
//   };

//   if (error) {
//     return (
//       <div 
//         className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-8 ${className || ''}`}
//         style={containerStyle}
//       >
//         <div className="text-center">
//           <div className="text-red-600 text-xl mb-4">⚠️</div>
//           <h3 className="text-lg font-semibold text-red-800 mb-2">Meeting Error</h3>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={initializeJitsi}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`relative ${className || ''}`} style={containerStyle}>
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
//           <div className="text-center text-white">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//             <p className="text-lg font-medium">Loading meeting...</p>
//             <p className="text-sm text-gray-300 mt-2">
//               Connecting to {roomName.replace(/[^a-zA-Z0-9]/g, '')}
//             </p>
//           </div>
//         </div>
//       )}
//       <div 
//         ref={jitsiContainerRef}
//         id={`jitsi-container-${roomName.replace(/[^a-zA-Z0-9]/g, '')}`}
//         style={{ width: "100%", height: "100%" }}
//       />
//     </div>
//   );
// }
