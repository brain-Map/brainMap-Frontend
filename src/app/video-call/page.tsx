'use client';

import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

// Get user ID from URL
function getQueryParam(name: string) {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const LOCAL_USER_ID = getQueryParam('id') || 'user1';
const SIGNALING_SERVER = 'ws://localhost:8080/ws';
const REMOTE_USER_ID = 'user2';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'failed';
type MediaType = 'camera' | 'screen';

export default function VideoChat() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<ConnectionStatus>('disconnected');
  const [peerStatus, setPeerStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string>('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentMediaType, setCurrentMediaType] = useState<MediaType | null>(null);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
  
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    setWsStatus('connecting');
    const socket = new WebSocket(`${SIGNALING_SERVER}?id=${LOCAL_USER_ID}`);
    setWs(socket);

    socket.onopen = () => {
      setWsStatus('connected');
      setError('');
    };

    socket.onclose = () => {
      setWsStatus('disconnected');
    };

    socket.onerror = () => {
      setWsStatus('failed');
      setError('WebSocket connection failed');
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'offer') {
        await handleIncomingCall('camera', data.from); // Pass fromId
      } else if (data.type === 'answer') {
        peerRef.current?.signal(data.signal);
      } else if (data.type === 'ice-candidate') {
        peerRef.current?.signal(data.candidate);
      }
    };

    return () => {
      socket.close();
      peerRef.current?.destroy();
    };
  }, []);

  const getMediaStream = async (mediaType: MediaType): Promise<MediaStream> => {
    if (mediaType === 'camera') {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } else {
      // Screen sharing
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: true 
      });
      
      // Listen for when user stops sharing screen
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        setError('Screen sharing stopped');
        endCall();
      });
      
      return screenStream;
    }
  };

  const handleIncomingCall = async (mediaType: MediaType, fromId?: string) => {
    try {
      const stream = await getMediaStream(mediaType);
      if (localVideo.current) {
        localVideo.current.srcObject = stream;
      }
      
      setCurrentMediaType(mediaType);
      setPeerStatus('connecting');
      const peer = new Peer({ initiator: false, trickle: false, stream });
      
      setRemoteUserId(fromId || 'user1'); // Use fromId from signaling data
      
      peer.on('signal', (signal: Peer.SignalData) => {
        ws?.send(JSON.stringify({ to: remoteUserId, from: LOCAL_USER_ID, type: 'answer', signal }));
      });
      
      peer.on('stream', (stream: MediaStream) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = stream;
        }
      });
      
      peer.on('connect', () => {
        setPeerStatus('connected');
        setIsCallActive(true);
        setError('');
      });
      
      peer.on('error', (err) => {
        setPeerStatus('failed');
        setError(`Peer connection error: ${err.message}`);
      });
      
      // Signal back with the offer data
      // peer.signal(data.signal); // This should use the actual offer signal
      peerRef.current = peer;
    } catch (err) {
      const errorMsg = mediaType === 'camera' 
        ? 'Camera access denied or unavailable' 
        : 'Screen sharing denied or unavailable';
      setError(`${errorMsg}: ${err}`);
    }
  };

  const startCall = async (mediaType: MediaType) => {
    try {
      setError('');
      const stream = await getMediaStream(mediaType);
      if (localVideo.current) {
        localVideo.current.srcObject = stream;
      }
      
      setCurrentMediaType(mediaType);
      setPeerStatus('connecting');
      const peer = new Peer({ initiator: true, trickle: false, stream });
      
      setRemoteUserId(mediaType === 'camera' ? 'user2' : 'user1'); // You may want to improve this logic
      
      peer.on('signal', (signal: Peer.SignalData) => {
        ws?.send(JSON.stringify({ to: remoteUserId, from: LOCAL_USER_ID, type: 'offer', signal }));
      });
      
      peer.on('stream', (stream: MediaStream) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = stream;
        }
      });
      
      peer.on('connect', () => {
        setPeerStatus('connected');
        setIsCallActive(true);
        setError('');
      });
      
      peer.on('error', (err) => {
        setPeerStatus('failed');
        setError(`Peer connection error: ${err.message}`);
      });
      
      peerRef.current = peer;
    } catch (err) {
      const errorMsg = mediaType === 'camera' 
        ? 'Camera access denied or unavailable' 
        : 'Screen sharing denied or unavailable';
      setError(`${errorMsg}: ${err}`);
    }
  };

  const switchMediaType = async (newMediaType: MediaType) => {
    if (!isCallActive || !peerRef.current) return;
    
    try {
      // Get new stream
      const newStream = await getMediaStream(newMediaType);
      
      // Stop old stream
      const oldStream = localVideo.current?.srcObject as MediaStream;
      oldStream?.getTracks().forEach(track => track.stop());
      
      // Update local video
      if (localVideo.current) {
        localVideo.current.srcObject = newStream;
      }
      
      // For simple-peer, we need to destroy and recreate the connection
      // because replaceTrack is not reliably exposed
      const wasInitiator = (peerRef.current as any).initiator;
      
      // Destroy current peer
      peerRef.current.destroy();
      
      // Create new peer with new stream
      setPeerStatus('connecting');
      const peer = new Peer({ initiator: wasInitiator, trickle: false, stream: newStream });
      
      peer.on('signal', (signal: Peer.SignalData) => {
        ws?.send(JSON.stringify({ 
          to: REMOTE_USER_ID, 
          from: LOCAL_USER_ID, 
          type: wasInitiator ? 'offer' : 'answer', 
          signal 
        }));
      });
      
      peer.on('stream', (stream: MediaStream) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = stream;
        }
      });
      
      peer.on('connect', () => {
        setPeerStatus('connected');
        setError('');
      });
      
      peer.on('error', (err) => {
        setPeerStatus('failed');
        setError(`Peer connection error: ${err.message}`);
      });
      
      peerRef.current = peer;
      setCurrentMediaType(newMediaType);
      setError('');
    } catch (err) {
      const errorMsg = newMediaType === 'camera' 
        ? 'Camera access denied or unavailable' 
        : 'Screen sharing denied or unavailable';
      setError(`${errorMsg}: ${err}`);
    }
  };

  const endCall = () => {
    peerRef.current?.destroy();
    peerRef.current = null;
    setPeerStatus('disconnected');
    setIsCallActive(false);
    setCurrentMediaType(null);
    
    // Stop local stream
    const stream = localVideo.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    if (localVideo.current) localVideo.current.srcObject = null;
    if (remoteVideo.current) remoteVideo.current.srcObject = null;
  };

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return '●';
      case 'connecting': return '◐';
      case 'failed': return '●';
      default: return '○';
    }
  };

  const getMediaTypeIcon = (mediaType: MediaType) => {
    return mediaType === 'camera' ? '📹' : '🖥️';
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Connection Status */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className={`text-lg ${getStatusColor(wsStatus)}`}>
            {getStatusText(wsStatus)}
          </span>
          <span>WebSocket: {wsStatus}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg ${getStatusColor(peerStatus)}`}>
            {getStatusText(peerStatus)}
          </span>
          <span>Peer: {peerStatus}</span>
          {currentMediaType && (
            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
              {getMediaTypeIcon(currentMediaType)} {currentMediaType}
            </span>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          {error}
        </div>
      )}

      {/* Video Elements */}
      <div className="flex gap-4">
        <div className="relative">
          <video ref={localVideo} autoPlay muted className="w-64 h-48 border rounded-xl" />
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            Local ({LOCAL_USER_ID})
            {currentMediaType && ` - ${getMediaTypeIcon(currentMediaType)}`}
          </div>
        </div>
        <div className="relative">
          <video ref={remoteVideo} autoPlay className="w-64 h-48 border rounded-xl" />
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            Remote ({remoteUserId ?? 'unknown'})
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        {!isCallActive ? (
          // Start Call Options
          <div className="flex gap-2">
            <button
              onClick={() => startCall('camera')}
              disabled={wsStatus !== 'connected'}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              📹 Start with Camera
            </button>
            
            <button
              onClick={() => startCall('screen')}
              disabled={wsStatus !== 'connected'}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              🖥️ Share Screen
            </button>
          </div>
        ) : (
          // Active Call Controls
          <div className="flex gap-2">
            {currentMediaType === 'camera' ? (
              <button
                onClick={() => switchMediaType('screen')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
              >
                🖥️ Switch to Screen
              </button>
            ) : (
              <button
                onClick={() => switchMediaType('camera')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              >
                📹 Switch to Camera
              </button>
            )}
            
            <button
              onClick={endCall}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              End Call
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 max-w-md text-center">
        <p><strong>Camera:</strong> Share your webcam feed</p>
        <p><strong>Screen Share:</strong> Share your entire screen or specific window</p>
        <p className="mt-2 text-xs">To test: Open in different browsers or use one tab for camera, another for screen share</p>
      </div>
    </div>
  );
}
