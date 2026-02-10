export type Language = 'pt' | 'en';

export const translations = {
  pt: {
    // Tela Inicial
    appSubtitle: 'Resolva problemas de código e torne-se um Mestre.',
    btnPlay: 'JOGAR',
    btnManual: 'MANUAL',
    btnLibrary: 'PADRÕES',
    
    // Login
    loginTitle: 'Identificação',
    loginSubtitle: 'Acesso ao Sistema',
    loginNew: 'Novo Investigador',
    loginPass: 'Senha',
    btnLoginAction: 'ENTRAR',
    btnCreateAction: 'CRIAR PERFIL',
    
    // Manual & HUD
    manualTitle: 'Manual de Campo',
    score: 'Score Missão',
    integrity: 'Integridade',
    
    // Briefing (Missão)
    missionBrief: 'Dossiê da Missão',
    objectives: 'Objetivos',
    btnAccept: 'ACEITAR MISSÃO',
    btnDecline: 'RECUSAR',
    
    // Configurações (Settings)
    settingsTitle: 'Configurações',
    settingsTheme: 'Modo Escuro',
    settingsSound: 'Efeitos Sonoros',
    settingsLang: 'Idioma',
    btnClose: 'Fechar',
    
    // Diálogos (Alertas)
    dialogLogoutTitle: 'Encerrar Sessão',
    dialogLogoutMsg: 'Deseja sair? O progresso não salvo será perdido.',
    dialogAbortTitle: 'Abortar Missão',
    dialogAbortMsg: 'Voltar ao mapa perderá o progresso atual desta fase.',
    btnConfirm: 'Confirmar',
    btnCancel: 'Cancelar'
  },
  en: {
    // Start Screen
    appSubtitle: 'Solve code problems and become a Master.',
    btnPlay: 'PLAY',
    btnManual: 'MANUAL',
    btnLibrary: 'PATTERNS',
    
    // Login
    loginTitle: 'Identification',
    loginSubtitle: 'System Access',
    loginNew: 'New Investigator',
    loginPass: 'Password',
    btnLoginAction: 'LOGIN',
    btnCreateAction: 'CREATE PROFILE',
    
    // Manual & HUD
    manualTitle: 'Field Manual',
    score: 'Mission Score',
    integrity: 'Integrity',
    
    // Briefing
    missionBrief: 'Mission Dossier',
    objectives: 'Objectives',
    btnAccept: 'ACCEPT MISSION',
    btnDecline: 'DECLINE',
    
    // Settings
    settingsTitle: 'Settings',
    settingsTheme: 'Dark Mode',
    settingsSound: 'Sound Effects',
    settingsLang: 'Language',
    btnClose: 'Close',
    
    // Dialogs
    dialogLogoutTitle: 'Logout',
    dialogLogoutMsg: 'Are you sure? Unsaved progress will be lost.',
    dialogAbortTitle: 'Abort Mission',
    dialogAbortMsg: 'Returning to map will reset current progress.',
    btnConfirm: 'Confirm',
    btnCancel: 'Cancel'
  }
};