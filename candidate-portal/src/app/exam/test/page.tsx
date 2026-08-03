"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import "../exam.css";
import {
  Clock, ChevronLeft, ChevronRight, Bookmark, CheckCircle2,
  Mic, Square, Send, AlertTriangle, Grid, X, FileText, RefreshCw
} from "lucide-react";
import { QuestionData, initialQuestions } from "@/lib/seedData";
import { getApiBaseUrl } from "@/lib/config";

export default function CandidateTestEngine() {
  const router = useRouter();

  const [candidate, setCandidate] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selectedOption: string | null; timeTakenSec: number }>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  const [timeLeftSec, setTimeLeftSec] = useState(3900);
  const [timerWarning, setTimerWarning] = useState("");

  const [activeTab, setActiveTab] = useState<"mcq" | "simulation">("mcq");
  const [simulationText, setSimulationText] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  const [tabSwitches, setTabSwitches] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [antiCheatLogs, setAntiCheatLogs] = useState<Array<{ eventType: string; details?: string }>>([]);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const loadQuestionsFromBackend = async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/questions`);
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setQuestions(initialQuestions);
      }
    } catch {
      setQuestions(initialQuestions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("banca_candidate");
    if (!stored) {
      router.push("/exam");
      return;
    }
    setCandidate(JSON.parse(stored));
    loadQuestionsFromBackend();
  }, [router]);

  useEffect(() => {
    if (loading || timeLeftSec <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSec((prev) => {
        const next = prev - 1;
        if (next === 1800) setTimerWarning("⚠️ 30 Minutes remaining!");
        else if (next === 600) setTimerWarning("⚠️ 10 Minutes remaining!");
        else if (next === 300) setTimerWarning("⚠️ 5 Minutes remaining!");
        else if (next === 60) setTimerWarning("🚨 CRITICAL: 1 Minute remaining!");
        else if (next <= 0) { clearInterval(interval); handleSubmitExam(); return 0; }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        setTabSwitches((p) => p + 1);
        setAntiCheatLogs((p) => [...p, { eventType: "TAB_SWITCH", details: new Date().toLocaleTimeString() }]);
      }
    };
    const onFs = () => {
      if (!document.fullscreenElement) {
        setFullscreenExits((p) => p + 1);
        setAntiCheatLogs((p) => [...p, { eventType: "FULLSCREEN_EXIT", details: new Date().toLocaleTimeString() }]);
      }
    };
    const noCtx = (e: MouseEvent) => { e.preventDefault(); setAntiCheatLogs((p) => [...p, { eventType: "RIGHT_CLICK" }]); };
    const noClip = (e: ClipboardEvent) => { e.preventDefault(); setAntiCheatLogs((p) => [...p, { eventType: "COPY_PASTE" }]); };

    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("contextmenu", noCtx);
    document.addEventListener("copy", noClip);
    document.addEventListener("paste", noClip);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("contextmenu", noCtx);
      document.removeEventListener("copy", noClip);
      document.removeEventListener("paste", noClip);
    };
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSelectOption = (qId: string, opt: string) => {
    setAnswers((p) => ({ ...p, [qId]: { selectedOption: opt, timeTakenSec: (p[qId]?.timeTakenSec || 0) + 5 } }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => setAudioBase64(reader.result as string);
      };
      mr.start();
      setRecording(true);
    } catch { alert("Microphone permission required. You may type your response instead."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) { mediaRecorderRef.current.stop(); setRecording(false); }
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}/api/v1/candidates/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate?.id,
          answers,
          simulation: { textResponse: simulationText, audioData: audioBase64 || undefined },
          antiCheatData: { tabSwitches, fullscreenExits, logs: antiCheatLogs },
        }),
      });
    } catch {}
    localStorage.removeItem("banca_candidate");
    router.push("/exam/thank-you");
  };

  const qStatus = (qId: string, idx: number) => {
    if (idx === currentIdx && activeTab === "mcq") return "current";
    if (flagged[qId]) return "flagged";
    if (answers[qId]?.selectedOption) return "answered";
    return "unvisited";
  };

  const answeredCount = Object.values(answers).filter((a) => a.selectedOption).length;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p className="loading-text">Fetching Questions from Database API…</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="loading-screen">
        <div className="loading-content" style={{ maxWidth: "420px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626", margin: "0 auto" }}>
            <AlertTriangle size={28} />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#1A2B40", marginTop: "12px" }}>Database Connection Error</h2>
          <p style={{ fontSize: "13px", color: "#4A6580", marginTop: "6px" }}>Unable to load questions from the server database.</p>
          <button
            onClick={loadQuestionsFromBackend}
            style={{ marginTop: "16px", padding: "10px 20px", borderRadius: "10px", background: "#00AEEF", color: "white", fontWeight: 800, fontSize: "13px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={14} /> Retry Connecting
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="test-page">
      <Navbar mode="candidate" candidateName={candidate?.name} />

      {/* Sub-bar */}
      <div className="test-subbar">
        <div className="test-subbar-inner">

          <div className="test-tab-group">
            <button
              onClick={() => setActiveTab("mcq")}
              className={`test-tab-btn test-tab-btn--mcq ${activeTab === "mcq" ? "active" : ""}`}
            >
              <FileText size={14} />
              <span>MCQs ({answeredCount}/{questions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("simulation")}
              className={`test-tab-btn test-tab-btn--sim ${activeTab === "simulation" ? "active" : ""}`}
            >
              <Mic size={14} />
              <span>Sec 7: Simulation</span>
            </button>
          </div>

          <div className="test-status-group">
            {tabSwitches > 0 && (
              <div className="test-antichat-badge">
                <AlertTriangle size={11} />
                <span>Tab: {tabSwitches}</span>
              </div>
            )}
            <div className={`test-timer ${timeLeftSec <= 300 ? "test-timer--critical" : ""}`}>
              <Clock size={14} />
              <span>{fmt(timeLeftSec)}</span>
            </div>
            <button className="test-palette-toggle" onClick={() => setPaletteOpen(true)}>
              <Grid size={14} />
              <span>Palette</span>
            </button>
          </div>

        </div>
      </div>

      {timerWarning && (
        <div className="test-warning-banner">
          <AlertTriangle size={14} />
          <span>{timerWarning}</span>
        </div>
      )}

      <div className="test-content-area">

        {/* MCQ Tab */}
        {activeTab === "mcq" && (
          <div className="question-card">
            <div className="question-card-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="question-section-badge">{currentQ.sectionName}</span>
                <span className="question-counter">Q{currentIdx + 1} / {questions.length}</span>
              </div>
              <button
                className={`question-flag-btn ${flagged[currentQ.id || ""] ? "question-flag-btn--on" : "question-flag-btn--off"}`}
                onClick={() => setFlagged((p) => ({ ...p, [currentQ.id || ""]: !p[currentQ.id || ""] }))}
              >
                <Bookmark size={13} />
                <span>{flagged[currentQ.id || ""] ? "Flagged" : "Flag"}</span>
              </button>
            </div>

            <div className="question-text">
              Q{currentIdx + 1}. {currentQ.question}
            </div>

            <div className="options-list">
              {(["A", "B", "C", "D"] as const).map((key) => {
                const textMap: Record<string, string> = {
                  A: currentQ.optionA, B: currentQ.optionB, C: currentQ.optionC, D: currentQ.optionD,
                };
                const isSelected = answers[currentQ.id || ""]?.selectedOption === key;
                return (
                  <div
                    key={key}
                    className={`option-item ${isSelected ? "option-item--selected" : ""}`}
                    onClick={() => handleSelectOption(currentQ.id || "", key)}
                  >
                    <div className="option-key">{key}</div>
                    <span className="option-text">{textMap[key]}</span>
                  </div>
                );
              })}
            </div>

            <div className="question-nav-row">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((p) => p - 1)}
                className="nav-btn nav-btn--outline"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                {currentIdx < questions.length - 1 ? (
                  <button onClick={() => setCurrentIdx((p) => p + 1)} className="nav-btn nav-btn--primary">
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button onClick={() => setActiveTab("simulation")} className="nav-btn nav-btn--violet">
                    Simulation <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Simulation Tab */}
        {activeTab === "simulation" && (
          <div className="sim-card">
            <div className="sim-card-header">
              <span className="sim-section-badge">Section 7 • Practical Roleplay (30 Marks)</span>
              <h2 className="sim-title">Banca ARM Customer Pitch Simulation</h2>
            </div>

            <div className="sim-card-body">
              <div className="sim-scenario-box">
                <div className="sim-scenario-label">
                  <FileText size={14} />
                  Roleplay Scenario Context
                </div>
                <p className="sim-scenario-text">
                  "You are an Assistant Relationship Manager at a bank branch. A customer has walked in to open a ₹5 Lakh Fixed Deposit for 3 years. During your conversation, you learn that the customer has a family but does not have adequate health insurance. Initiate a conversation to discover the customer's protection needs and introduce the relevance of Niva Bupa health insurance."
                </p>
              </div>

              {/* Audio Recording */}
              <div className="sim-option-block">
                <div className="sim-option-title">
                  <Mic size={14} />
                  Option A: Record Voice Response (3–5 Minutes)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
                  {!recording ? (
                    <button onClick={startRecording} className="sim-record-btn sim-record-btn--start">
                      <Mic size={15} /> Start Recording
                    </button>
                  ) : (
                    <button onClick={stopRecording} className="sim-record-btn sim-record-btn--stop">
                      <Square size={15} /> Stop Recording
                    </button>
                  )}
                  {audioBase64 && (
                    <div className="sim-audio-done">
                      <CheckCircle2 size={14} /> Audio Recorded ✓
                    </div>
                  )}
                </div>
              </div>

              {/* Written Response */}
              <div>
                <label className="exam-field-label" style={{ marginBottom: "8px", display: "block" }}>
                  Option B: Written Sales Pitch Script
                </label>
                <textarea
                  className="sim-textarea"
                  rows={5}
                  placeholder="Type how you would pitch Niva Bupa health insurance to this customer…"
                  value={simulationText}
                  onChange={(e) => setSimulationText(e.target.value)}
                />
              </div>
            </div>

            <div className="sim-submit-row">
              <button onClick={handleSubmitExam} disabled={submitting} className="sim-submit-btn">
                <Send size={18} />
                {submitting ? "Submitting…" : "Final Submit Exam"}
              </button>
            </div>
          </div>
        )}

        {/* Question Palette */}
        {paletteOpen && (
          <div className="palette-overlay" onClick={() => setPaletteOpen(false)} />
        )}
        <div className={`palette-drawer ${paletteOpen ? "open" : ""}`}>
          <div className="palette-card" style={{ height: "100%", borderRadius: 0 }}>
            <div className="palette-card-header">
              <span className="palette-card-title">
                <Grid size={15} /> Question Palette
              </span>
              <button className="palette-close-btn hidden-desktop" onClick={() => setPaletteOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="palette-legend">
              {[
                { color: "#00AEEF", label: `Current` },
                { color: "#16A34A", label: `Done (${answeredCount})` },
                { color: "#F7941D", label: `Flagged (${Object.values(flagged).filter(Boolean).length})` },
                { color: "#CBD5E1", label: "Unvisited" },
              ].map((l) => (
                <div key={l.label} className="palette-legend-item">
                  <span className="legend-dot" style={{ background: l.color }} />
                  <span>{l.label}</span>
                </div>
              ))}
            </div>

            <div className="palette-grid">
              {questions.map((q, idx) => {
                const s = qStatus(q.id || "", idx);
                return (
                  <button
                    key={q.id || idx}
                    className={`palette-q-btn palette-q-btn--${s}`}
                    onClick={() => { setActiveTab("mcq"); setCurrentIdx(idx); setPaletteOpen(false); }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="palette-submit-area">
              <button className="palette-submit-btn" onClick={handleSubmitExam} disabled={submitting}>
                <Send size={14} /> Submit Exam
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
