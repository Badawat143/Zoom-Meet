import { useState, useRef, useEffect, FormEvent } from 'react';
import { ChatMessage, Participant } from '../types';
import { Send, Smile, Paperclip, X, ChevronDown, CheckCheck, Sparkles } from 'lucide-react';
import { zoomSounds } from '../utils/soundEffects';

interface ChatDrawerProps {
  messages: ChatMessage[];
  participants: Participant[];
  currentUserId: string;
  onSendMessage: (text: string, recipientId?: string, recipientName?: string) => void;
  onClose: () => void;
}

export default function ChatDrawer({
  messages,
  participants,
  currentUserId,
  onSendMessage,
  onClose,
}: ChatDrawerProps) {
  const [inputText, setInputText] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('everyone');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    let recipientName: string | undefined;
    if (selectedRecipientId !== 'everyone') {
      const recipient = participants.find((p) => p.id === selectedRecipientId);
      recipientName = recipient?.name;
    }

    onSendMessage(inputText.trim(), selectedRecipientId === 'everyone' ? undefined : selectedRecipientId, recipientName);
    zoomSounds.playChatPop();
    setInputText('');
  };

  const handleQuickEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const QUICK_REPLIES = [
    '👍 Looks good to me!',
    'Can everyone see the slides?',
    'I agree with that point.',
    'Quick question on the timeline.',
    'Dropping the notes link here 🔗',
    'Sorry, was on double mute!',
  ];

  return (
    <div id="zoom-chat-drawer" className="w-80 sm:w-88 h-full bg-zinc-900 border-l border-zinc-800 flex flex-col z-30 shadow-2xl animate-slide-in">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-zinc-200">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-white">Meeting Chat</h3>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
            {messages.length}
          </span>
        </div>
        <button
          id="close-chat-btn"
          onClick={onClose}
          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-text text-xs">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {!isMe && msg.senderAvatar && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                <span className="font-semibold text-zinc-300 text-[11px]">
                  {isMe ? 'You' : msg.senderName}
                </span>
                {msg.recipientId && (
                  <span className="text-[10px] text-rose-400 font-medium">
                    (Direct Message)
                  </span>
                )}
                <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
              </div>

              <div
                className={`px-3 py-2 rounded-xl max-w-[90%] leading-relaxed ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : msg.recipientId
                    ? 'bg-rose-950/60 border border-rose-800/60 text-rose-200 rounded-bl-xs'
                    : 'bg-zinc-800 text-zinc-100 rounded-bl-xs border border-zinc-700/50'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-1.5 border-t border-zinc-800/80 bg-zinc-950/40 overflow-x-auto flex gap-1.5 no-scrollbar">
        {QUICK_REPLIES.map((reply, i) => (
          <button
            key={i}
            onClick={() => {
              setInputText(reply);
            }}
            className="whitespace-nowrap px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] border border-zinc-700/60 transition-colors shrink-0"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Container */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900">
        {/* Recipient Dropdown */}
        <div className="flex items-center justify-between mb-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span>To:</span>
            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-zinc-200 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="everyone">Everyone</option>
              {participants
                .filter((p) => p.id !== currentUserId)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Direct Message)
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Input Box */}
        <form onSubmit={handleSend} className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              selectedRecipientId === 'everyone'
                ? 'Type message to everyone...'
                : 'Type private message...'
            }
            rows={2}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 pr-20 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
          />

          <div className="absolute right-2 bottom-2.5 flex items-center gap-1">
            {/* Quick Emoji Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <Smile className="w-4 h-4" />
              </button>
              {showEmojiPicker && (
                <div className="absolute right-0 bottom-full mb-2 bg-zinc-800 border border-zinc-700 p-2 rounded-lg shadow-xl grid grid-cols-4 gap-1.5 text-lg z-50">
                  {['👍', '👏', '❤️', '😂', '🎉', '🚀', '🔥', '👀'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleQuickEmoji(emoji)}
                      className="p-1 hover:bg-zinc-700 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 rounded-md text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
