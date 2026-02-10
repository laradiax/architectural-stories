// src/utils/audio.ts
export const playSound = (fileName: string, enabled: boolean) => {
    if (!enabled) return;
    
    const audio = new Audio(`../../public/sounds/${fileName}`); // Certifique-se que o caminho está correto
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Áudio bloqueado pelo navegador:", err));
};