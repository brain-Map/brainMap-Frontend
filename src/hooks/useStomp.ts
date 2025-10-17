"use client"

import { useEffect, useRef, useCallback } from "react"
import { Client, IMessage, Frame } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:8080/ws"

export type StompCallback = (msg: IMessage) => void

export interface UseStompOptions {
  token?: string
  userId?: string
  onConnect?: () => void
  onError?: (err: any) => void
}

/**
 * useStomp - STOMP (SockJS) Client.
 */
export function useStomp(options: UseStompOptions = {}) {
  const { token, userId, onConnect, onError } = options
  const clientRef = useRef<Client | null>(null)
  const subscriptionsRef = useRef<Record<string, any>>({})

  const connect = useCallback(() => {
    if (clientRef.current && clientRef.current.connected) return

    clientRef.current = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      debug: (str) => {
      },
      onConnect: (frame?: Frame) => {
        onConnect && onConnect()
      },
      onStompError: (frame) => {
        onError && onError(frame)
      },
      onWebSocketError: (err) => onError && onError(err),
    })

    clientRef.current.activate()
  }, [token, onConnect, onError])

  const disconnect = useCallback(() => {
    try {
      Object.values(subscriptionsRef.current).forEach((s: any) => s?.unsubscribe && s.unsubscribe())
      subscriptionsRef.current = {}
      clientRef.current?.deactivate()
      clientRef.current = null
    } catch (e) {
      // swallow
    }
  }, [])

  const subscribe = useCallback((destination: string, cb: StompCallback, headers: Record<string, string> = {}) => {
    if (!clientRef.current) return null
    try {
      const sub = clientRef.current.subscribe(destination, cb, headers)
      subscriptionsRef.current[destination] = sub
      return sub
    } catch (e) {
      onError && onError(e)
      return null
    }
  }, [onError])

  const unsubscribe = useCallback((destination: string) => {
    const sub = subscriptionsRef.current[destination]
    try {
      sub?.unsubscribe && sub.unsubscribe()
    } catch (e) {
      // ignore
    }
    delete subscriptionsRef.current[destination]
  }, [])

  const publish = useCallback((destination: string, body: any, headers: Record<string, string> = {}) => {
    if (!clientRef.current?.connected) return false
    try {
      clientRef.current.publish({ destination, body: typeof body === 'string' ? body : JSON.stringify(body), headers: token ? { Authorization: `Bearer ${token}`, ...headers } : headers })
      return true
    } catch (e) {
      onError && onError(e)
      return false
    }
  }, [token, onError])

  // auto connect when token and userId present
  useEffect(() => {
    if (token && userId) {
      connect()
      return () => disconnect()
    }
    // if token/userId not present, ensure disconnected
    disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId])

  return {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    client: clientRef,
  }
}

export default useStomp
