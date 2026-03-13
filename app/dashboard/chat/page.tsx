// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// interface Conversation {
//   sessionId: number;
//   otherUser: {
//     id: number;
//     firstName: string;
//     lastName: string;
//     avatar?: string;
//   };
//   lastMessage?: string;
//   unread: number;
// }

// interface Message {
//   id: number;
//   sessionId: number;
//   senderId: number;
//   content: string;
//   createdAt: string;
//   sender: {
//     id: number;
//     firstName: string;
//     avatar?: string;
//   };
// }

// export default function ChatPage() {

//   const searchParams = useSearchParams();

//   const sessionParam = searchParams?.get("sessionId");
//   const userParam = searchParams?.get("userId");

//   const [user, setUser] = useState<any>(null);
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeSession, setActiveSession] = useState<number | null>(
//     sessionParam ? Number(sessionParam) : null
//   );
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [text, setText] = useState("");

//   const bottomRef = useRef<HTMLDivElement>(null);

//   /* ================= USER ================= */

//   useEffect(() => {

//     async function loadUser() {
//       const res = await fetch("/api/auth/me", {
//         credentials: "include",
//       });

//       const data = await res.json();
//       setUser(data.user);
//     }

//     loadUser();

//   }, []);

//   /* ================= RESOLVE SESSION ================= */

//   useEffect(() => {

//     async function resolveSession() {

//       if (!userParam) return;

//       const res = await fetch(`/api/chat/find-session?userId=${userParam}`, {
//         credentials: "include",
//       });

//       const data = await res.json();

//       if (data.session?.id) {

//         setActiveSession(data.session.id);

//         window.history.replaceState(
//           null,
//           "",
//           `/dashboard/chat?sessionId=${data.session.id}`
//         );
//       }
//     }

//     if (!sessionParam && userParam) {
//       resolveSession();
//     }

//   }, [userParam, sessionParam]);

//   /* ================= LOAD CONVERSATIONS ================= */

//   async function loadConversations() {

//     try {

//       const res = await fetch("/api/chat/conversations", {
//         credentials: "include",
//       });

//       const data = await res.json();
//       setConversations(data.conversations || []);

//     } catch (err) {
//       console.error("Conversation load error:", err);
//     }
//   }

//   useEffect(() => {
//     loadConversations();
//   }, []);

//   /* ================= LOAD MESSAGES ================= */

//   async function loadMessages(sessionId: number) {

//     try {

//       const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`, {
//         credentials: "include",
//       });

//       const data = await res.json();

//       setMessages(data.messages || []);

//       await fetch("/api/chat/read", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sessionId }),
//       });

//     } catch (err) {
//       console.error("Message load error:", err);
//     }
//   }

//   useEffect(() => {
//     if (activeSession) {
//       loadMessages(activeSession);
//     }
//   }, [activeSession]);

//   /* ================= SOCKET CONNECTION ================= */

//   useEffect(() => {

//     if (!user) return;

//     fetch("/api/socket");

//     socket = io({
//       path: "/api/socket/io",
//     });

//     socket.on("connect", () => {

//       console.log("socket connected");

//       socket!.emit("join-user", user.id);

//     });

//     return () => {
//       socket?.disconnect();
//     };

//   }, [user]);

//   /* ================= MESSAGE LISTENER ================= */

//   useEffect(() => {

//     if (!socket) return;

//     const handleMessage = (msg: Message) => {

//       console.log("new message received:", msg);

//       if (msg.sessionId === activeSession) {
//         setMessages((prev) => [...prev, msg]);
//       }

//       loadConversations();
//     };

//     socket?.on("new-message", handleMessage);

// return () => {
//   socket?.off("new-message", handleMessage);
// };

//   }, [activeSession]);

//   /* ================= JOIN ROOM ================= */

//   useEffect(() => {

//     if (!socket) return;
//     if (!activeSession) return;

//     console.log("joining room:", activeSession);

//     socket?.emit("join-room", activeSession);

//   }, [activeSession]);

//   /* ================= SEND MESSAGE ================= */

//   function sendMessage() {

//     if (!text.trim() || !activeSession || !socket || !user) return;

//     const tempMessage = {
//       id: Date.now(),
//       sessionId: activeSession,
//       senderId: user.id,
//       content: text,
//       createdAt: new Date().toISOString(),
//       sender: {
//         id: user.id,
//         firstName: user.firstName,
//         avatar: user.avatar,
//       },
//     };


//     socket?.emit("send-message", {
//   sessionId: activeSession,
//   senderId: user.id,
//   content: text,
// });
//     setText("");
//   }

//   /* ================= AUTO SCROLL ================= */

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ================= ACTIVE CONVERSATION ================= */

//   const activeConversation =
//     conversations.find((c) => c.sessionId === activeSession);

//   /* ================= UI ================= */

//   return (

//     <div className="flex h-[80vh] bg-white border rounded-xl overflow-hidden">

//       {/* LEFT PANEL */}

//       <div className="w-[320px] border-r overflow-y-auto">

//         {conversations.map((c) => (

//           <div
//             key={c.sessionId}
//             onClick={() => setActiveSession(c.sessionId)}
//             className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
//               activeSession === c.sessionId ? "bg-gray-100" : ""
//             }`}
//           >

//             <div className="flex items-center gap-3">

//               {c.otherUser.avatar ? (
//                 <img
//                   src={c.otherUser.avatar}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
//                   {c.otherUser.firstName[0]}
//                 </div>
//               )}

//               <div className="flex-1">

//                 <div className="flex justify-between">

//                   <div className="font-semibold text-sm">
//                     {c.otherUser.firstName} {c.otherUser.lastName}
//                   </div>

//                   {c.unread > 0 && (
//                     <span className="bg-green-500 text-white text-xs px-2 rounded-full">
//                       {c.unread}
//                     </span>
//                   )}

//                 </div>

//                 <div className="text-xs text-gray-500 truncate">
//                   {c.lastMessage || "No messages yet"}
//                 </div>

//               </div>

//             </div>

//           </div>

//         ))}

//       </div>

//       {/* RIGHT CHAT */}

//       <div className="flex-1 flex flex-col">

//         {!activeSession && (
//           <div className="flex-1 flex items-center justify-center text-gray-400">
//             Select a conversation
//           </div>
//         )}

//         {activeSession && (

//           <>

//             {/* HEADER */}

//             <div className="border-b px-4 py-3 flex items-center gap-3">

//               {activeConversation?.otherUser.avatar ? (
//                 <img
//                   src={activeConversation.otherUser.avatar}
//                   className="w-10 h-10 rounded-full"
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
//                   {activeConversation?.otherUser.firstName[0]}
//                 </div>
//               )}

//               <div>

//                 <div className="font-semibold text-sm">
//                   {activeConversation?.otherUser.firstName}{" "}
//                   {activeConversation?.otherUser.lastName}
//                 </div>

//                 <div className="text-xs text-green-500">
//                   Active now
//                 </div>

//               </div>

//             </div>

//             {/* MESSAGES */}

//             <div className="flex-1 overflow-y-auto p-4 space-y-3">

//               {messages.map((m) => (

//                 <div
//                   key={m.id}
//                   className={`flex ${
//                     m.senderId === user?.id
//                       ? "justify-end"
//                       : "justify-start"
//                   }`}
//                 >

//                   <div
//                     className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
//                       m.senderId === user?.id
//                         ? "bg-green-500 text-white"
//                         : "bg-gray-200"
//                     }`}
//                   >
//                     {m.content}
//                   </div>

//                 </div>

//               ))}

//               <div ref={bottomRef} />

//             </div>

//             {/* INPUT */}

//             <div className="border-t p-3 flex gap-2">

//               <input
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1 border rounded-lg px-3 py-2 text-sm"
//               />

//               <button
//                 onClick={sendMessage}
//                 className="bg-[#4a5e27] text-white px-4 rounded-lg"
//               >
//                 Send
//               </button>

//             </div>

//           </>

//         )}

//       </div>

//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

interface Conversation {
sessionId: number;
otherUser: {
id: number;
firstName: string;
lastName: string;
avatar?: string;
};
lastMessage?: string;
lastMessageTime?: string;
unread: number;
}

interface Message {
id: number;
sessionId: number;
senderId: number;
content: string;
createdAt: string;
sender: {
id: number;
firstName: string;
avatar?: string;
};
}

export default function ChatPage() {

const searchParams = useSearchParams();

const sessionParam = searchParams?.get("sessionId");
const userParam = searchParams?.get("userId");

const [user, setUser] = useState<any>(null);
const [conversations, setConversations] = useState<Conversation[]>([]);
const [activeSession, setActiveSession] = useState<number | null>(
sessionParam ? Number(sessionParam) : null
);
const [messages, setMessages] = useState<Message[]>([]);
const [text, setText] = useState("");
const [search, setSearch] = useState("");

const bottomRef = useRef<HTMLDivElement>(null);

/* ================= USER ================= */

useEffect(() => {
async function loadUser() {
const res = await fetch("/api/auth/me", {
credentials: "include",
});
const data = await res.json();
setUser(data.user);
}
loadUser();
}, []);

/* ================= RESOLVE SESSION ================= */

useEffect(() => {


async function resolveSession() {

  if (!userParam) return;

  const res = await fetch(`/api/chat/find-session?userId=${userParam}`, {
    credentials: "include",
  });

  const data = await res.json();

  if (data.session?.id) {

    setActiveSession(data.session.id);

    window.history.replaceState(
      null,
      "",
      `/dashboard/chat?sessionId=${data.session.id}`
    );
  }
}

if (!sessionParam && userParam) {
  resolveSession();
}


}, [userParam, sessionParam]);

/* ================= LOAD CONVERSATIONS ================= */

async function loadConversations() {


try {

  const res = await fetch("/api/chat/conversations", {
    credentials: "include",
  });

  const data = await res.json();

  setConversations(data.conversations || []);

} catch (err) {
  console.error("Conversation load error:", err);
}


}

useEffect(() => {
loadConversations();
}, []);

/* ================= LOAD MESSAGES ================= */

async function loadMessages(sessionId: number) {


try {

  const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`, {
    credentials: "include",
  });

  const data = await res.json();

  setMessages(data.messages || []);

  await fetch("/api/chat/read", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });

} catch (err) {
  console.error("Message load error:", err);
}


}

useEffect(() => {
if (activeSession) {
loadMessages(activeSession);
}
}, [activeSession]);

/* ================= SOCKET ================= */

useEffect(() => {


if (!user) return;

fetch("/api/socket");

socket = io({
  path: "/api/socket/io",
});

socket.on("connect", () => {

  console.log("socket connected");

  socket!.emit("join-user", user.id);

});

return () => {
  socket?.disconnect();
};

}, [user]);

/* ================= MESSAGE LISTENER ================= */

useEffect(() => {

if (!socket) return;

const handleMessage = (msg: Message) => {

  if (msg.sessionId === activeSession) {
    setMessages((prev) => [...prev, msg]);
  }

  loadConversations();
};

socket?.on("new-message", handleMessage);

return () => {
  socket?.off("new-message", handleMessage);
};


}, [activeSession]);

/* ================= JOIN ROOM ================= */

useEffect(() => {


if (!socket) return;
if (!activeSession) return;

socket.emit("join-room", activeSession);


}, [activeSession]);

/* ================= SEND MESSAGE ================= */

function sendMessage() {


if (!text.trim() || !activeSession || !socket || !user) return;

socket.emit("send-message", {
  sessionId: activeSession,
  senderId: user.id,
  content: text,
});

setText("");


}

/* ================= AUTO SCROLL ================= */

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

/* ================= ACTIVE CONVERSATION ================= */

const activeConversation =
conversations.find((c) => c.sessionId === activeSession);

/* ================= SEARCH FILTER ================= */

const filteredConversations = conversations.filter((c) =>
`${c.otherUser.firstName} ${c.otherUser.lastName}`
.toLowerCase()
.includes(search.toLowerCase())
);

/* ================= UI ================= */

return (


<div className="flex h-[80vh] bg-white border rounded-xl overflow-hidden">

  {/* LEFT PANEL */}

  <div className="w-[340px] border-r flex flex-col">

    {/* INBOX HEADER */}

    <div className="p-4 border-b">

      <h2 className="font-semibold text-lg mb-3">
        Inbox
      </h2>

      <input
        placeholder="Search user"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

    </div>

    {/* CONVERSATIONS */}

    <div className="flex-1 overflow-y-auto">

      {filteredConversations.map((c) => (

        <div
          key={c.sessionId}
          onClick={() => setActiveSession(c.sessionId)}
          className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
            activeSession === c.sessionId ? "bg-gray-100" : ""
          }`}
        >

          <div className="flex items-center gap-3">

            <img
              src={c.otherUser.avatar || "/avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1">

              <div className="flex justify-between">

                <div className="font-semibold text-sm">
                  {c.otherUser.firstName} {c.otherUser.lastName}
                </div>

                <div className="text-xs text-gray-400">
                  {c.lastMessageTime
                    ? new Date(c.lastMessageTime).toLocaleTimeString()
                    : ""}
                </div>

              </div>

              <div className="flex justify-between items-center">

                <div className="text-xs text-gray-500 truncate">
                  {c.lastMessage || "No messages yet"}
                </div>

                {c.unread > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 rounded-full">
                    {c.unread}
                  </span>
                )}

              </div>

            </div>

          </div>

        </div>

      ))}

    </div>

  </div>

  {/* RIGHT CHAT */}

  <div className="flex-1 flex flex-col">

    {!activeSession && (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation
      </div>
    )}

    {activeSession && (

      <>

        {/* CHAT HEADER */}

        <div className="border-b px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <img
              src={activeConversation?.otherUser.avatar || "/avatar.png"}
              className="w-10 h-10 rounded-full"
            />

            <div>

              <div className="font-semibold text-sm">
                {activeConversation?.otherUser.firstName}{" "}
                {activeConversation?.otherUser.lastName}
              </div>

              <div className="text-xs text-green-500">
                Active now
              </div>

            </div>

          </div>

          <a
            href={`/dashboard/profile/${activeConversation?.otherUser.id}`}
             className="px-4 py-2 border rounded-lg text-sm font-medium text-[#4a5e27] border-[#4a5e27] hover:bg-[#4a5e27] hover:text-white transition text-center"
          >
            View Profile
          </a>

        </div>

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {messages.map((m) => (

            <div
              key={m.id}
              className={`flex ${
                m.senderId === user?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
                  m.senderId === user?.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {m.content}
              </div>

            </div>

          ))}

          <div ref={bottomRef} />

        </div>

        {/* INPUT */}

        <div className="border-t p-3 flex gap-2">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />

          <button
            onClick={sendMessage}
            className="bg-[#4a5e27] text-white px-4 rounded-lg"
          >
            Send
          </button>

        </div>

      </>

    )}

  </div>

</div>


);
}
