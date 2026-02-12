const BASE_URL = import.meta.env.BASE_URL;

const getSoundPath = (filename: string) => {
    const cleanName = filename.startsWith('/') ? filename.slice(1) : filename;
    const prefix = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
    return `${prefix}sounds/${cleanName}`;
};

// Singleton para a música de fundo
let bgmAudio: HTMLAudioElement | null = null;
// Flag para controlar se devemos tentar o autoplay
let shouldPlayBGM = false;

export const playSound = (soundFile: string, soundEnabled: boolean) => {
  if (!soundEnabled) return;

  try {
    const path = getSoundPath(soundFile);
    const audio = new Audio(path);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {
    console.error("Audio error:", e);
  }
};

export const playBGM = (soundFile: string, soundEnabled: boolean) => {
    // Atualiza a intenção de tocar
    shouldPlayBGM = soundEnabled;

    // Se estiver desativado, PAUSA e retorna
    if (!soundEnabled) {
        if (bgmAudio) {
            bgmAudio.pause();
        }
        return;
    }
    
    // Se já estiver tocando, não faz nada
    if (bgmAudio && !bgmAudio.paused) return;

    try {
        // Inicializa se necessário
        if (!bgmAudio) {
            const path = getSoundPath(soundFile);
            bgmAudio = new Audio(path);
            bgmAudio.loop = true;
            bgmAudio.volume = 0.05;
        }
        
        // Tenta tocar
        const playPromise = bgmAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                console.log("Autoplay bloqueado. Aguardando interação...");
                
                // Função para iniciar no clique
                const startOnInteraction = () => {
                    // SÓ TOCA SE AINDA ESTIVER ATIVADO
                    if (shouldPlayBGM && bgmAudio) {
                        bgmAudio.play().catch(() => {});
                    }
                    // Limpa os listeners
                    document.removeEventListener('click', startOnInteraction);
                    document.removeEventListener('keydown', startOnInteraction);
                };
                
                document.addEventListener('click', startOnInteraction);
                document.addEventListener('keydown', startOnInteraction);
            });
        }
    } catch (e) {
        console.error("BGM Error:", e);
    }
};

export const stopBGM = () => {
    shouldPlayBGM = false;
    if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }
};

export const toggleBGM = (enabled: boolean) => {
    shouldPlayBGM = enabled;
    if (bgmAudio) {
        if (enabled) bgmAudio.play().catch(() => {});
        else bgmAudio.pause();
    }
};