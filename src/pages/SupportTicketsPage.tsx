import type { SupportTicket } from "@/types";
import { LifeBuoy, Send } from "lucide-react";
import { FormEvent, useState } from "react";

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const submitTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = String(formData.get("subject") ?? "").trim();
    if (!subject) return;
    setTickets([
      {
        id: crypto.randomUUID(),
        subject,
        status: "Open",
        createdAt: new Date().toISOString(),
      },
      ...tickets,
    ]);
    event.currentTarget.reset();
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <LifeBuoy className="w-8 h-8 text-primary" />
        Support Tickets
      </h1>
      <div className="grid lg:grid-cols-[420px_1fr] gap-8">
        <form onSubmit={submitTicket} className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-white">Create Ticket</h2>
          <label className="block">
            <span className="text-sm text-gray-300">Subject</span>
            <input name="subject" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </label>
          <label className="block">
            <span className="text-sm text-gray-300">Message</span>
            <textarea rows={5} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </label>
          <button className="w-full rounded-xl bg-primary py-3 font-bold text-white hover:bg-primary/90 flex items-center justify-center gap-2">
            <Send className="w-5 h-5" /> Submit Ticket
          </button>
        </form>
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-gray-400">No support tickets yet.</div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="glass-card rounded-2xl p-5">
                <h2 className="font-bold text-white">{ticket.subject}</h2>
                <p className="mt-1 text-sm text-gray-400">{ticket.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
