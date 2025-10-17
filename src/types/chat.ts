export enum MessageType {
  CHAT = 'CHAT',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE'
}

export interface ChatMessage {
  message: string;
  sender: string;
  type: MessageType;
}