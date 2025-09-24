import { useEffect, useRef, useState } from "react";

export default function ThemeMusic() {
    const audioRef = useRef(null);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const handleUserInteraction = () => {
            if (audioRef.current && !hasStarted) {
                audioRef.current.play().catch((err) => {
                    console.log("Error playing audio:", err);
                });
                setHasStarted(true);
            }
        };

        // Listen once for any click/keypress
        window.addEventListener("click", handleUserInteraction);
        window.addEventListener("keydown", handleUserInteraction);

        return () => {
            window.removeEventListener("click", handleUserInteraction);
            window.removeEventListener("keydown", handleUserInteraction);
        };
    }, [hasStarted]);

    return (
        <audio ref={audioRef} src="/music/theme.mp3" loop />
    );
}
