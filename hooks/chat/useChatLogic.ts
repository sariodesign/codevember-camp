import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useChatLogic() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) {
        return;
      }

      if (toolCall.toolName === "getCurrentTime") {
      }
    },
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isBusy = status !== "ready";

  const submitMessage = useCallback(() => {
    if (!input.trim() || isBusy) {
      return;
    }

    sendMessage({ text: input });
    setInput("");
  }, [input, isBusy, sendMessage]);

  const placeholderText = useMemo(() => {
    switch (status) {
      case "streaming":
        return "Thinking...";
      case "error":
        return "Something went wrong. Try again.";
      default:
        return "Ask me anything (Shift+Enter for newline)";
    }
  }, [status]);

  return {
    messages,
    input,
    setInput,
    status,
    isBusy,
    submitMessage,
    placeholderText,
    messagesEndRef,
  };
}
