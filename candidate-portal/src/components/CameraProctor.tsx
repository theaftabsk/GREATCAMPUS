"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { CheckCircle2, ShieldAlert, AlertTriangle } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface CameraProctorProps {
  mode: "pre-exam" | "exam";
  attemptId?: string;
  onVerificationChange?: (isVerified: boolean, message: string) => void;
  onWarningTrigger?: (eventType: string, message: string) => void;
}

export default function CameraProctor({
  mode,
  attemptId,
  onVerificationChange,
  onWarningTrigger,
}: CameraProctorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scheduledTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastWarningTimeRef = useRef<number>(0);

  const [cameraActive, setCameraActive] = useState(false);
  const [faceStatus, setFaceStatus] = useState<"FACE_OK" | "NO_FACE" | "MULTIPLE_FACES" | "CAMERA_OFF">("CAMERA_OFF");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Stable callback refs — avoids React hook dependency size mismatch
  const onVerificationRef = useRef(onVerificationChange);
  const onWarningRef = useRef(onWarningTrigger);
  useEffect(() => { onVerificationRef.current = onVerificationChange; });
  useEffect(() => { onWarningRef.current = onWarningTrigger; });

  const SCHEDULED_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
  const WARNING_COOLDOWN_MS = 10000; // 10 seconds cooldown between warnings

  // ── Helper: Upload screenshot ──────────────────────────────────────────
  const uploadScreenshot = useCallback(async (type: "SCHEDULED" | "WARNING", eventType?: string) => {
    if (!attemptId || !videoRef.current || !cameraActive) return;
    try {
      const video = videoRef.current;
      const offCanvas = document.createElement("canvas");
      offCanvas.width = video.videoWidth || 640;
      offCanvas.height = video.videoHeight || 480;
      const ctx = offCanvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, offCanvas.width, offCanvas.height);
      const imageBase64 = offCanvas.toDataURL("image/jpeg", 0.65);

      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}/api/v1/proctoring/upload-screenshot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, type, eventType, imageBase64 }),
      });
    } catch (err) {
      console.error("Screenshot upload failed:", err);
    }
  }, [attemptId, cameraActive]);

  const uploadScreenshotRef = useRef(uploadScreenshot);
  useEffect(() => { uploadScreenshotRef.current = uploadScreenshot; });

  // ── Load face-api.js TinyFaceDetector model ────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function loadModels() {
      try {
        // Dynamically import face-api.js only on client side
        const faceapi = await import("face-api.js");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        if (!cancelled) {
          console.log("✅ face-api.js TinyFaceDetector model loaded");
          setModelsLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load face-api models:", err);
      }
    }
    loadModels();
    return () => { cancelled = true; };
  }, []);

  // ── Start camera ───────────────────────────────────────────────────────
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: false,
        });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setCameraActive(true);
      } catch (err: any) {
        console.error("Camera error:", err);
        setCameraActive(false);
        setFaceStatus("CAMERA_OFF");
        if (onVerificationRef.current) {
          onVerificationRef.current(false, "Camera permission denied or unavailable.");
        }
      }
    }
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const noFaceStreakRef = useRef<number>(0);
  const multiFaceStreakRef = useRef<number>(0);

  // ── Face detection loop (face-api.js TinyFaceDetector - Medium Sensitivity) ─
  useEffect(() => {
    if (!cameraActive || !modelsLoaded) return;

    async function runDetection() {
      const faceapi = await import("face-api.js");
      // Medium Sensitivity: scoreThreshold 0.38 (balanced), inputSize 320 (precise multi-face bounding)
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.38 });

      detectionLoopRef.current = setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.paused || video.ended || video.readyState < 2) return;

        try {
          const detections = await faceapi.detectAllFaces(video, options);
          const count = detections.length;

          if (count === 0) {
            noFaceStreakRef.current += 1;
            multiFaceStreakRef.current = 0;

            // Require 3 consecutive failed checks (3 seconds) before triggering NO_FACE alert
            if (noFaceStreakRef.current >= 3) {
              setFaceStatus("NO_FACE");
              if (onVerificationRef.current) onVerificationRef.current(false, "No face detected in camera.");

              const now = Date.now();
              if (now - lastWarningTimeRef.current > WARNING_COOLDOWN_MS) {
                lastWarningTimeRef.current = now;
                if (onWarningRef.current) {
                  onWarningRef.current("FACE_NOT_DETECTED", "⚠️ Face not detected! Please ensure your face is clearly visible.");
                }
                uploadScreenshotRef.current("WARNING", "FACE_NOT_DETECTED");
              }
            }

          } else if (count > 1) {
            multiFaceStreakRef.current += 1;
            noFaceStreakRef.current = 0;

            // Require 2 consecutive checks (2 seconds) of multiple faces before triggering MULTIPLE_FACES alert
            if (multiFaceStreakRef.current >= 2) {
              setFaceStatus("MULTIPLE_FACES");
              if (onVerificationRef.current) onVerificationRef.current(false, "Multiple faces detected.");

              const now = Date.now();
              if (now - lastWarningTimeRef.current > WARNING_COOLDOWN_MS) {
                lastWarningTimeRef.current = now;
                if (onWarningRef.current) {
                  onWarningRef.current("MULTIPLE_FACES", "⚠️ Multiple faces detected! Only the candidate should be in front of the camera.");
                }
                uploadScreenshotRef.current("WARNING", "MULTIPLE_FACES");
              }
            }

          } else {
            // Exactly 1 face detected — OK!
            noFaceStreakRef.current = 0;
            multiFaceStreakRef.current = 0;
            setFaceStatus("FACE_OK");
            if (onVerificationRef.current) onVerificationRef.current(true, "Face verified ✅");
          }
        } catch (err) {
          console.error("Face detection error:", err);
        }
      }, 1000); // Check every 1 second
    }

    runDetection();

    return () => {
      if (detectionLoopRef.current) clearInterval(detectionLoopRef.current);
    };
  }, [cameraActive, modelsLoaded]);

  // ── Scheduled 15-minute screenshot (Initial baseline at 3s + every 15 mins) ──
  useEffect(() => {
    if (mode !== "exam" || !attemptId || !cameraActive) return;

    // Take initial baseline verification screenshot 3 seconds after camera start
    const initialCaptureTimer = setTimeout(() => {
      console.log("📸 Capturing initial baseline proctoring screenshot...");
      uploadScreenshotRef.current("SCHEDULED", "EXAM_START_BASELINE");
    }, 3000);

    // Recurring 15-minute interval screenshot capture
    scheduledTimerRef.current = setInterval(() => {
      console.log("📸 Scheduled 15-min proctoring screenshot capture...");
      uploadScreenshotRef.current("SCHEDULED", "PERIODIC_15_MIN");
    }, SCHEDULED_INTERVAL_MS);

    return () => {
      clearTimeout(initialCaptureTimer);
      if (scheduledTimerRef.current) clearInterval(scheduledTimerRef.current);
    };
  }, [mode, attemptId, cameraActive]);

  // ── PIP Badge render ───────────────────────────────────────────────────
  const borderColor =
    faceStatus === "FACE_OK" ? "#22C55E" :
    faceStatus === "MULTIPLE_FACES" ? "#F59E0B" : "#EF4444";

  const bannerBg =
    faceStatus === "FACE_OK" ? "rgba(22,101,52,0.92)" :
    faceStatus === "MULTIPLE_FACES" ? "rgba(146,64,14,0.92)" : "rgba(185,28,28,0.92)";


  return (
    <>
      {/* Hidden canvas for screenshot capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* PIP Camera Badge (bottom-right) */}
      <div style={{
        position: "fixed", bottom: "20px", right: "20px", zIndex: 9999,
        width: "164px", borderRadius: "14px", overflow: "hidden",
        background: "#0F172A", boxShadow: "0 10px 32px rgba(0,0,0,0.4)",
        border: `2.5px solid ${borderColor}`,
        transition: "border-color 0.25s",
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "120px", objectFit: "cover", transform: "scaleX(-1)", display: "block" }}
        />

        {/* Model loading spinner overlay */}
        {!modelsLoaded && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(15,23,42,0.85)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px"
          }}>
            <div style={{
              width: "22px", height: "22px", border: "3px solid #334155",
              borderTopColor: "#38BDF8", borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            <span style={{ color: "#94A3B8", fontSize: "9px", fontWeight: 700 }}>Loading AI...</span>
          </div>
        )}

        {/* Status Banner */}
        <div style={{
          background: bannerBg, color: "white",
          padding: "4px 6px", fontSize: "10px", fontWeight: 800,
          textAlign: "center", display: "flex", alignItems: "center",
          justifyContent: "center", gap: "4px",
          transition: "background 0.25s",
        }}>
          {faceStatus === "FACE_OK" ? (
            <><CheckCircle2 size={11} color="#4ADE80" /> Live Monitoring</>
          ) : faceStatus === "MULTIPLE_FACES" ? (
            <><AlertTriangle size={11} color="#FCD34D" /> Multiple Faces</>
          ) : (
            <><ShieldAlert size={11} color="#FCA5A5" /> Face Alert</>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
