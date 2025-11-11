type MessageType = "message" | "ping" | "get old";

interface Message {
  content: string;
  type: MessageType;
}

interface WebSocketMessage {
  id: number;
  time: string;
  user_id: number;
  content: string;
  type: string;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private pingInterval: number | null = null;
  private chatId: number | null = null;

  connect(userId: number, chatId: number, token: string): void {
    // Close existing connection if any
    this.disconnect();

    this.chatId = chatId;

    this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);

    this.socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      this.startPing();
      // Request old messages
      this.getOldMessages();
    });

    this.socket.addEventListener("close", (event) => {
      if (event.wasClean) {
        console.log("WebSocket connection closed cleanly");
      } else {
        console.log("WebSocket connection interrupted");
      }
      console.log(`Code: ${event.code} | Reason: ${event.reason}`);
      this.stopPing();
    });

    this.socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    this.socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.stopPing();
      this.socket.close();
      this.socket = null;
      this.chatId = null;
    }
  }

  sendMessage(content: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    const message: Message = {
      content,
      type: "message",
    };

    this.socket.send(JSON.stringify(message));
  }

  getOldMessages(offset: number = 0): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    this.socket.send(
      JSON.stringify({
        content: offset.toString(),
        type: "get old",
      }),
    );
  }

  private startPing(): void {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: "ping",
          }),
        );
      }
    }, 10000);
  }

  private stopPing(): void {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private handleMessage(data: WebSocketMessage | WebSocketMessage[] | { type: string }): void {
    // Handle ping/pong
    if (!Array.isArray(data) && "type" in data && data.type === "pong") {
      return;
    }

    // Handle message or array of messages
    if (Array.isArray(data)) {
      console.log("Received messages:", data);
      // Store messages in the store
      const messages = window.store.getState().messages || {};
      if (this.chatId !== null) {
        messages[this.chatId] = data.reverse();
        window.store.set({ messages });
      }
    } else if ("content" in data) {
      console.log("Received single message:", data);
      // Add single message to existing messages
      const messages = window.store.getState().messages || {};
      if (this.chatId !== null && data.type === "message") {
        const chatMessages = messages[this.chatId] || [];
        messages[this.chatId] = [...chatMessages, data];
        window.store.set({ messages });
      }
    }
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  getCurrentChatId(): number | null {
    return this.chatId;
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
