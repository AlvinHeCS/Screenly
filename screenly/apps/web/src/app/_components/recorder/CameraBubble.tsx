"use client";

import { useEffect, useRef } from "react";

import { useRecorder } from "./RecorderContext";

/**
 * Loom's circular webcam bubble (`loom-camera-layer`). Streams the live camera
 * from the recorder engine; the self-view is mirrored (scaleX -1) the way
 * webcam previews conventionally are. Falls back to a labelled placeholder when
 * the camera is off or permission was denied. Dark fill uses the `grey8` token
 * (`hsla(228,6%,17%,1)`).
 *
 * Note: this is the on-screen preview only. The bubble baked into the recording
 * is drawn (un-mirrored) onto the compositor canvas in `useRecorderEngine`; both
 * sit bottom-left so what you see matches what records.
 */
export function CameraBubble() {
  const { cameraStream, cameraOn, cameraError } = useRecorder();
  const videoRef = useRef<HTMLVideoElement>(null);

  const showVideo = cameraOn && cameraStream !== null;

  // Re-run on showVideo too: the <video> only mounts when showVideo is true, so
  // depending on cameraStream alone would miss binding srcObject if the element
  // remounts without the stream identity changing.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.srcObject !== cameraStream) {
      video.srcObject = cameraStream;
    }
    if (cameraStream) void video.play().catch(() => undefined);
  }, [cameraStream, showVideo]);

  return (
    <div
      role="img"
      aria-label="Camera preview"
      className="pointer-events-auto flex h-[240px] w-[240px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[hsla(228,6%,17%,1)] shadow-[0_6px_24px_rgba(0,0,0,0.25)]"
    >
      {showVideo ? (
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          className="h-full w-full -scale-x-100 object-cover"
        />
      ) : (
        <span className="px-[12px] text-center text-[12px] font-medium text-[hsla(0,0%,100%,0.7)]">
          {cameraError ? "Camera blocked" : "Camera off"}
        </span>
      )}
    </div>
  );
}
