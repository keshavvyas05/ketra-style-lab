import { useEffect, useMemo, useState } from "react";
import { Trophy, Crown, Check, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Submission = Tables<"outfit_submissions">;

const AdminOOTW = () => {
  const [tab, setTab] = useState<"current" | "hall">("current");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const loadSubmissions = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("outfit_submissions").select("*");
      if (!alive) return;
      if (error) {
        console.error("Failed to load submissions", error);
        setSubmissions([]);
        setLoading(false);
        return;
      }
      setSubmissions(data ?? []);
      setLoading(false);
    };
    void loadSubmissions();
    return () => {
      alive = false;
    };
  }, []);

  const currentWeekSubmissions = useMemo(() => submissions.filter((s) => !s.is_winner), [submissions]);
  const pastWinners = useMemo(() => submissions.filter((s) => s.is_winner), [submissions]);

  // Calculate days until Monday
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;

  return (
    <div className="space-y-6">
      {/* Week Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-extrabold tracking-wide">Week 10 · March 2026</h3>
          <p className="text-muted-foreground font-body text-sm flex items-center gap-1.5">
            <Calendar size={14} /> {daysUntilMonday} days until Monday reset
          </p>
        </div>
        {/* Tabs */}
        <div className="bg-card/70 border border-border/40 rounded-xl flex overflow-hidden">
          {(["current", "hall"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 font-display text-xs tracking-[0.1em] uppercase transition-colors ${tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "current" ? "This Week" : "Hall of Fame"}
            </button>
          ))}
        </div>
      </div>

      {tab === "current" && (
        <>
          {/* Submissions Table */}
          <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    {["#", "User", "Instagram", "Type", "Style", "Trend", "Create", "Impress", "AI Total", "Votes", "Final", "Date"].map((h) => (
                      <th key={h} className="text-left py-3 px-2 font-display text-[9px] tracking-[0.12em] uppercase text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentWeekSubmissions.map((s, i) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedWinner(s.id)}
                      className={`border-b border-border/20 hover:bg-secondary/20 transition-colors cursor-pointer ${selectedWinner === s.id ? "bg-accent/10 border-accent/30" : ""}`}
                    >
                      <td className="py-3 px-2">
                        {i === 0 ? <Crown size={14} className="text-[hsl(45_100%_55%)]" /> : <span className="font-display text-xs text-muted-foreground">#{i + 1}</span>}
                      </td>
                      <td className="py-3 px-2 font-display text-sm font-bold">{s.instagram_id || "User"}</td>
                      <td className="py-3 px-2 font-body text-xs text-accent">{s.instagram_id || "—"}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full font-display text-[9px] tracking-[0.1em] uppercase font-bold ${s.submission_type === "real_photo" ? "bg-[hsl(160_60%_45%_/_0.15)] text-[hsl(160_60%_45%)]" : "bg-[hsl(200_70%_55%_/_0.15)] text-[hsl(200_70%_55%)]"}`}>
                          {s.submission_type === "real_photo" ? "Photo" : "VTO"}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-display text-xs">{s.style_score ?? 0}</td>
                      <td className="py-3 px-2 font-display text-xs">{s.trend_score ?? 0}</td>
                      <td className="py-3 px-2 font-display text-xs">{s.creativity_score ?? 0}</td>
                      <td className="py-3 px-2 font-display text-xs">{s.impression_score ?? 0}</td>
                      <td className="py-3 px-2 font-display text-sm font-bold text-accent">{s.total_score ?? 0}</td>
                      <td className="py-3 px-2 font-display text-sm">{s.community_votes ?? 0}</td>
                      <td className="py-3 px-2 font-display text-sm font-extrabold">{s.total_score ?? 0}</td>
                      <td className="py-3 px-2 font-body text-xs text-muted-foreground">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {!loading && currentWeekSubmissions.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">No submissions found.</div>
          )}
          {loading && <div className="p-6 text-sm text-muted-foreground">Loading submissions...</div>}

          {/* Confirm Winner */}
          {selectedWinner && !confirmed && (
            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 text-center">
              <Trophy size={32} className="text-accent mx-auto mb-3" />
              <h3 className="font-display text-lg font-extrabold mb-1">
                Confirm {currentWeekSubmissions.find((s) => s.id === selectedWinner)?.instagram_id || "this user"} as this week's winner?
              </h3>
              <p className="text-muted-foreground font-body text-sm mb-4">They will receive 2 free try-ons and be featured on the leaderboard.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setConfirmed(true)} className="px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-display text-xs tracking-[0.1em] uppercase flex items-center gap-1.5">
                  <Check size={14} /> Confirm Winner
                </button>
                <button onClick={() => setSelectedWinner(null)} className="px-6 py-2.5 rounded-xl border border-border/50 text-muted-foreground font-display text-xs tracking-[0.1em] uppercase hover:text-foreground">
                  Cancel
                </button>
              </div>
            </div>
          )}
          {confirmed && (
            <div className="bg-[hsl(160_60%_45%_/_0.08)] border border-[hsl(160_60%_45%_/_0.3)] rounded-2xl p-4 flex items-center gap-3">
              <Check size={18} className="text-[hsl(160_60%_45%)]" />
              <span className="font-body text-sm text-foreground">Winner confirmed! 2 free try-ons credited.</span>
            </div>
          )}
        </>
      )}

      {tab === "hall" && (
        <div className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl p-5">
          <h3 className="font-display text-sm font-extrabold tracking-wide mb-4 flex items-center gap-2">
            <Crown size={16} className="text-[hsl(45_100%_55%)]" /> Hall of Fame
          </h3>
          <div className="space-y-3">
            {pastWinners.map((w) => (
              <div key={w.id} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(45_100%_55%)] to-[hsl(35_100%_40%)] flex items-center justify-center">
                  <Trophy size={16} className="text-background" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm font-bold">{w.instagram_id || "Winner"}</p>
                  <p className="font-body text-xs text-muted-foreground">Week {w.week_number} · {w.year}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm font-bold">{w.total_score ?? 0}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{w.created_at ? new Date(w.created_at).toLocaleDateString() : "—"}</p>
                </div>
              </div>
            ))}
            {!loading && pastWinners.length === 0 && <p className="text-sm text-muted-foreground">No winners yet.</p>}
            {loading && <p className="text-sm text-muted-foreground">Loading winners...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOOTW;
