import ChatSidebar from '@/components/cinesync/chat-sidebar';
import MainView from '@/components/cinesync/main-view';
import ParticipantsPanel from '@/components/cinesync/participants-panel';

export default function WatchPage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch the schedule details using params.id
  // For now, we'll pass a mock title based on the ID.
  const movieTitle = `Movie for party ${params.id}`;

  return (
    <div className="flex h-screen w-full bg-slate-800" style={{backgroundColor: "hsl(0, 0%, 20%)"}}>
      <main className="flex-1 flex flex-col overflow-y-auto">
        <MainView movieTitle={movieTitle} />
        <ParticipantsPanel />
      </main>
      <ChatSidebar movieTitle={movieTitle}/>
    </div>
  );
}
