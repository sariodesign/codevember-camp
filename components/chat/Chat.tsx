"use client";

import React, { useEffect, useRef } from "react";
import { useChatLogic } from "@/hooks/chat/useChatLogic";

export default function Chat() {
  const {
    messages,
    input,
    setInput,
    status,
    isBusy,
    submitMessage,
    placeholderText,
    messagesEndRef,
  } = useChatLogic();

  const ToolMessage = ({
    toolName,
    output,
  }: {
    toolName: string;
    output: string;
  }) => (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm bg-yellow-300 text-slate-900">
        <span className="block text-xs font-semibold uppercase tracking-wide opacity-70">
          Tool [{toolName}] response
        </span>
        {output?.trim() || "..."}
      </div>
    </div>
  );

  function ToolAddGoogleCalendarEvent({ output }: { output: string }) {
    const dispatchedRef = useRef(false);

    useEffect(() => {
      if (dispatchedRef.current) return;
      if (!output || !output.trim()) return;

      try {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("calendar:updated"));
        }
      } catch (e) {
        console.error("Error dispatching calendar:updated event", e);
      }

      dispatchedRef.current = true;
    }, [output]);

    return <ToolMessage toolName="addGoogleCalendarEvent" output={output} />;
  }

  return (
    <>
      <style>{`F
        textarea::-webkit-scrollbar {
          display: none;
        }
        textarea {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="flex h-screen w-full max-w-3xl flex-col gap-4 bg-slate-50 p-6 pt-16 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:mx-auto">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Chatbot
            </p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              How can I help you today?
            </h1>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {status === "ready"
              ? "Online"
              : status === "streaming"
              ? "Responding"
              : "Idle"}
          </span>
        </header>

        <section className="flex-1 overflow-y-auto rounded-2xl border border-transparent bg-white/60 p-4 shadow-inner dark:bg-slate-950/40">
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="mx-auto max-w-sm rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Start a conversation to see replies here.
              </div>
            ) : (
              messages.map((message) => {
                return message.parts.map((part, partIndex) => {
                  switch (part.type) {
                    case "text": {
                      const textContent = part.text;

                      if (!textContent.trim()) {
                        return null;
                      }

                      const isUser = message.role === "user";

                      return (
                        <div
                          key={`${message.id}-${partIndex}`}
                          className={`flex ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
                              isUser
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                            }`}
                          >
                            <span className="block text-xs font-semibold uppercase tracking-wide opacity-70">
                              {isUser ? "You" : "Assistant"}
                            </span>
                            {textContent.trim().length > 0
                              ? textContent
                              : "..."}
                          </div>
                        </div>
                      );
                    }

                    case "tool-getAllTheEvents":
                      return (
                        <ToolMessage
                          key={message.id}
                          toolName="getAllTheEvents"
                          output={part.output?.toString() || ""}
                        />
                      );

                    case "tool-addGoogleCalendarEvent":
                      return (
                        <ToolAddGoogleCalendarEvent
                          key={message.id}
                          output={part.output?.toString() || ""}
                        />
                      );

                    default:
                      return null;
                  }
                });
              })
            )}
          </div>
          <div ref={messagesEndRef} />
        </section>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitMessage();
          }}
          className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg focus-within:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isBusy}
            placeholder={placeholderText}
            rows={1}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitMessage();
              }
            }}
            className="max-h-40 flex-1 resize-none bg-transparent py-5 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60 scrollbar-hide dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-blue-300 dark:focus-visible:ring-offset-slate-950"
          >
            {isBusy ? "Sending" : "Send"}
          </button>
        </form>
      </div>
    </>
  );
}
