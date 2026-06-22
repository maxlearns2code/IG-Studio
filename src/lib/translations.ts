export type Locale = "en" | "fr";

export const translations = {
  en: {
    // Main page actions
    alertMissingFiles: "Please upload both followers and following JSON files.",
    alertParseError: "Error parsing files. Ensure they are valid JSON.",
    btnProcessing: "Processing Matrix...",
    btnReRun: "RE-RUN ANALYSIS",
    btnRun: "RUN INITIAL ANALYSIS",
    
    // MainHeader
    headerDescription: "Premium social hygiene and account balance terminal.",
    
    // DataUpload
    followers: "Followers",
    following: "Following",
    files: "Files",
    fileSelected: "file(s) selected",
    followersData: "Followers Data",
    followingData: "Following Data",
    compactUpdateTip: "Click any icon to update source data",
    noFilesTitle: "Don't have your Followers & Following JSON files yet?",
    noFilesDesc: "Use our secure, local-only Instagram Scraper script to scroll and download your data in seconds.",
    getScraperScript: "Get Scraper Script",
    
    // AnalysisResults
    mutuals: "Mutuals",
    imbalance: "Imbalance",
    tabNonFollowers: "Non-Followers",
    tabFans: "Your Fans",
    tabAutomation: "Automation Assistant",
    emptyNonFollowers: "Everyone you follow follows you back!",
    emptyFans: "No pending follow requests or fans.",
    
    // AutomationModule
    safeAutomationProtocol: "Safe Automation Protocol",
    safeAutomationDesc: "This userscript runs directly in your browser with randomized 30-210s delays to avoid detection.",
    autoStep1: "Copy your personalized userscript below",
    autoStep2: "Create a new script in Tampermonkey",
    autoStep3: "After running, click Download Deleted List to sync local data",
    copyUserscript: "Copy Userscript",
    copiedToClipboard: "Copied to Clipboard!",
    customizedTargets: "Customized for {count} targets",
    
    // ScraperGuideModal
    modalTitle: "Instagram Scraper Console",
    modalDesc: "Extract followers & following data safely in your browser.",
    privacyTitle: "Privacy-First Extraction",
    privacyDesc: "This script runs entirely inside your own browser window. No login details, passwords, or personal data are ever sent anywhere. All information remains on your local computer.",
    opt1Title: "Option 1: One-Click Copy",
    opt1Desc: "Fastest method. Copy the script code directly to your clipboard to paste in the browser console.",
    opt1Btn: "Copy Scraper Script",
    opt1BtnLoading: "Loading Script...",
    opt1BtnCopied: "Copied!",
    opt2Title: "Option 2: Direct File Download",
    opt2Desc: "Download the file to your computer. Useful if you want to open it in a text editor like Notepad.",
    opt2Btn: "Download .js File",
    stepTitle: "Step-by-Step Instructions",
    step1Title: "Copy the script code",
    step1Desc: "Click the 'Copy Scraper Script' button above to automatically copy the clean JavaScript code to your clipboard.",
    step2Title: "Go to Instagram on your desktop",
    step2Desc: "Open Instagram.com in Google Chrome, Microsoft Edge, or Firefox on a computer (not a phone) and make sure you are logged in.",
    step3Title: "Open your Profile lists",
    step3Desc: "Go to your profile (or the target account) and click on the 'followers' or 'following' count link to open the scrolling popup window.",
    step4Title: "Open the Developer Console",
    step4Desc: "Right-click anywhere on the page and choose Inspect (or press F12 / Ctrl+Shift+I on Windows, Cmd+Option+I on Mac). Select the Console tab at the top of the panel.",
    step5Title: "Paste & Press Enter",
    step5Desc1: "Click inside the console box at the bottom, paste (Ctrl+V or Cmd+V) the copied code, and press Enter.",
    step5Warning: "First time? If your browser prevents pasting, you must type allow pasting in the console and press Enter first, then try pasting again.",
    step6Title: "Wait for auto-download",
    step6Desc: "The script will scroll the list and download your JSON data automatically. Use the STOP & SAVE button in the top-left if you need to stop early.",
    viewCodeBtn: "View Scraper Code Script",
    loadingEngineCode: "Loading engine code...",
    modalFooter: "Need help? Press F12 to inspect elements. Make sure to close the console when done."
  },
  fr: {
    // Main page actions
    alertMissingFiles: "Veuillez importer les fichiers JSON d'abonnés et d'abonnements.",
    alertParseError: "Erreur lors de l'analyse des fichiers. Assurez-vous qu'il s'agit de fichiers JSON valides.",
    btnProcessing: "Traitement de la matrice...",
    btnReRun: "RELANCER L'ANALYSE",
    btnRun: "LANCER L'ANALYSE INITIALE",
    
    // MainHeader
    headerDescription: "Terminal premium d'hygiène sociale et d'équilibre de compte.",
    
    // DataUpload
    followers: "Abonnés",
    following: "Abonnements",
    files: "Fichiers",
    fileSelected: "fichier(s) sélectionné(s)",
    followersData: "Données des abonnés",
    followingData: "Données des abonnements",
    compactUpdateTip: "Cliquez sur une icône pour mettre à jour les données",
    noFilesTitle: "Vous n'avez pas encore vos fichiers JSON d'abonnés et d'abonnements ?",
    noFilesDesc: "Utilisez notre script de récupération Instagram sécurisé et local pour faire défiler et télécharger vos données en quelques secondes.",
    getScraperScript: "Obtenir le script",
    
    // AnalysisResults
    mutuals: "Mutuels",
    imbalance: "Déséquilibre",
    tabNonFollowers: "Sans retour",
    tabFans: "Vos fans",
    tabAutomation: "Assistant d'automatisation",
    emptyNonFollowers: "Tous ceux que vous suivez vous suivent en retour !",
    emptyFans: "Aucun fan ou demande de suivi en attente.",
    
    // AutomationModule
    safeAutomationProtocol: "Protocole d'automatisation sécurisé",
    safeAutomationDesc: "Ce script s'exécute directement dans votre navigateur avec des délais aléatoires de 30 à 210 secondes pour éviter la détection.",
    autoStep1: "Copiez votre script personnalisé ci-dessous",
    autoStep2: "Créez un nouveau script dans Tampermonkey",
    autoStep3: "Après l'exécution, cliquez sur Télécharger la liste des comptes supprimés pour synchroniser vos données locales",
    copyUserscript: "Copier le script",
    copiedToClipboard: "Copié dans le presse-papiers !",
    customizedTargets: "Personnalisé pour {count} cibles",
    
    // ScraperGuideModal
    modalTitle: "Console d'extraction Instagram",
    modalDesc: "Extrayez les données de vos abonnés et abonnements en toute sécurité dans votre navigateur.",
    privacyTitle: "Extraction confidentielle",
    privacyDesc: "Ce script s'exécute entièrement dans votre propre navigateur. Aucun identifiant, mot de passe ou donnée personnelle n'est transmis. Toutes les informations restent sur votre ordinateur local.",
    opt1Title: "Option 1 : Copie en un clic",
    opt1Desc: "Méthode la plus rapide. Copiez le code du script directement dans le presse-papiers pour le coller dans la console du navigateur.",
    opt1Btn: "Copier le script",
    opt1BtnLoading: "Chargement du script...",
    opt1BtnCopied: "Copié !",
    opt2Title: "Option 2 : Téléchargement direct",
    opt2Desc: "Téléchargez le fichier sur votre ordinateur. Utile si vous souhaitez l'ouvrir dans un éditeur de texte comme le Bloc-notes.",
    opt2Btn: "Télécharger le fichier .js",
    stepTitle: "Instructions étape par étape",
    step1Title: "Copier le code du script",
    step1Desc: "Cliquez sur le bouton 'Copier le script' ci-dessus pour copier automatiquement le code JavaScript dans votre presse-papiers.",
    step2Title: "Allez sur Instagram sur votre ordinateur",
    step2Desc: "Ouvrez Instagram.com dans Google Chrome, Microsoft Edge ou Firefox sur un ordinateur (pas sur un téléphone) et assurez-vous d'être connecté.",
    step3Title: "Ouvrez les listes de votre profil",
    step3Desc: "Accédez à votre profil (ou au compte cible) et cliquez sur le lien du nombre d'abonnés ou d'abonnements pour ouvrir la fenêtre contextuelle de défilement.",
    step4Title: "Ouvrez la console de développement",
    step4Desc: "Faites un clic droit n'importe où sur la page et choisissez Inspecter (ou appuyez sur F12 / Ctrl+Maj+I sur Windows, Cmd+Option+I sur Mac). Sélectionnez l'onglet Console en haut du panneau.",
    step5Title: "Coller et appuyer sur Entrée",
    step5Desc1: "Cliquez à l'intérieur de la console en bas, collez le code copié (Ctrl+V ou Cmd+V), et appuyez sur Entrée.",
    step5Warning: "Première fois ? Si votre navigateur empêche le collage, vous devez taper allow pasting dans la console et appuyer sur Entrée d'abord, puis réessayer de coller.",
    step6Title: "Attendre le téléchargement automatique",
    step6Desc: "Le script fera défiler la liste et téléchargera automatiquement vos données au format JSON. Utilisez le bouton STOP & SAVE en haut à gauche pour arrêter plus tôt.",
    viewCodeBtn: "Voir le code du script",
    loadingEngineCode: "Chargement du code...",
    modalFooter: "Besoin d'aide ? Appuyez sur F12 pour inspecter les éléments. N'oubliez pas de fermer la console lorsque vous avez terminé."
  }
} as const;
