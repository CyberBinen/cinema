import ChatSidebar from '@/components/cinesync/chat-sidebar';
import MainView from '@/components/cinesync/main-view';

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-slate-800" style={{backgroundColor: "hsl(0, 0%, 20%)"}}>
      <main className="flex-1 flex flex-col overflow-y-auto">
        <MainView />
      </main>
      <ChatSidebar />
    </div>
  );
}
