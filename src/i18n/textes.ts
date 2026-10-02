/* ==========================================================================
   Speed Express Shipping — textes de l'application
   --------------------------------------------------------------------------
   Quatre langues : français, anglais, espagnol, créole haïtien. Le français
   est la langue source ; les trois autres suivent le même ordre partout,
   comme dans les dictionnaires du site.

   Les libellés de statut reprennent mot pour mot ceux du site : un client
   qui lit « Disponib » sur son téléphone doit retrouver « Disponib » dans
   son espace en ligne.
   ========================================================================== */

export const LANGUES = ['fr', 'en', 'es', 'ht'] as const;
export type Langue = (typeof LANGUES)[number];

export const NOMS_LANGUES: Record<Langue, string> = {
  fr: 'Français', en: 'English', es: 'Español', ht: 'Kreyòl',
};

const textes = {
  fr: {
    /* Général */
    app: 'Speed Express', reessayer: 'Réessayer', chargement: 'Chargement…',
    fermer: 'Fermer', enregistrer: 'Enregistrer', annuler: 'Annuler',
    erreurGenerale: 'Une erreur est survenue. Réessayez dans un instant.',
    horsLigne: 'Pas de connexion. Les données affichées datent de votre dernière visite.',
    copie: 'Copié',

    /* Connexion */
    bonjour: 'Bon retour', sousTitreConnexion: 'Suivez vos colis en direct.',
    connectezCompte: 'Connectez-vous à votre compte Speed Express',
    emailRequis: 'Saisissez d’abord votre adresse e-mail.',
    email: 'Adresse e-mail', motDePasse: 'Mot de passe',
    seConnecter: 'Se connecter', creerCompte: 'Créer un compte',
    pasDeCompte: 'Pas encore de compte ?', dejaUnCompte: 'Déjà un compte ?',
    motDePasseOublie: 'Mot de passe oublié ?',
    nomComplet: 'Nom complet', telephone: 'Téléphone',
    lienEnvoye: 'Si cette adresse existe, un lien vient de partir.',
    envoyerLien: 'Envoyer le lien',
    recuperation: 'Récupération', sousTitreRecuperation: 'Nous vous envoyons un lien par e-mail.',
    identifiantsRefuses: 'Adresse ou mot de passe incorrect.',
    inscriptionFaite: 'Compte créé. Vérifiez votre boîte mail pour confirmer.',

    /* Colis */
    mesColis: 'Mes colis', aucunColis: 'Aucun colis pour le moment',
    aucunColisDetail: 'Dès que Speed Express enregistre un colis à votre nom, il apparaît ici.',
    rechercherColis: 'Numéro, description, expéditeur',
    poids: 'Poids', destination: 'Destination', expediteur: 'Expéditeur',
    destinataire: 'Destinataire', valeur: 'Valeur déclarée',
    parcours: 'Parcours', misAJour: 'Mis à jour', enregistreLe: 'Enregistré le',
    aucunResultat: 'Aucun colis ne correspond',
    etape: 'Étape', surQuatre: 'sur 4',
    suivi: 'Suivi', numColis: 'N° de suivi', copierNumero: 'Copier le numéro',
    recents: 'Envois récents',
    statut: 'Statut', de: 'De', vers: 'À', suiviEnDirect: 'Suivi en direct',

    /* Statuts — repris du site, mot pour mot */
    confirme: 'Confirmé', expedie: 'Expédié', disponible: 'Disponible',
    livre: 'Livré', action: 'Action requise',

    /* Factures */
    mesFactures: 'Mes factures', aucuneFacture: 'Aucune facture',
    aucuneFactureDetail: 'Vos factures apparaîtront ici dès le premier colis facturé.',
    facture: 'Facture', montant: 'Montant', paye: 'Payé', balance: 'Balance',
    payee: 'Payée', impayee: 'Impayée', echeance: 'Échéance',
    totalColis: 'Total colis', fraisService: 'Frais de service',
    grandTotal: 'Grand total', detail: 'Détail', quantite: 'Qté',
    aRegler: 'À régler', toutEstRegle: 'Tout est réglé',

    /* Profil */
    profil: 'Profil', monCompte: 'Mon compte', identifiant: 'Identifiant client',
    langue: 'Langue', notifications: 'Notifications',
    notificationsDetail: 'Être prévenu quand un colis change de statut',
    changerMotDePasse: 'Changer le mot de passe',
    nouveauMotDePasse: 'Nouveau mot de passe', motDePasseChange: 'Mot de passe modifié',
    seDeconnecter: 'Se déconnecter', profilEnregistre: 'Profil enregistré',
    adresse: 'Adresse', ville: 'Ville', pays: 'Pays',
    aide: 'Aide et contact', ecrireWhatsApp: 'Écrire sur WhatsApp', appeler: 'Appeler',
    version: 'Version',
  },

  en: {
    app: 'Speed Express', reessayer: 'Try again', chargement: 'Loading…',
    fermer: 'Close', enregistrer: 'Save', annuler: 'Cancel',
    erreurGenerale: 'Something went wrong. Please try again shortly.',
    horsLigne: 'No connection. You are seeing data from your last visit.',
    copie: 'Copied',

    bonjour: 'Welcome back', sousTitreConnexion: 'Track your packages live.',
    connectezCompte: 'Sign in to your Speed Express account',
    emailRequis: 'Enter your email address first.',
    email: 'Email address', motDePasse: 'Password',
    seConnecter: 'Sign in', creerCompte: 'Create account',
    pasDeCompte: 'No account yet?', dejaUnCompte: 'Already have an account?',
    motDePasseOublie: 'Forgot password?',
    nomComplet: 'Full name', telephone: 'Phone',
    lienEnvoye: 'If that address exists, a link is on its way.',
    envoyerLien: 'Send the link',
    recuperation: 'Password reset', sousTitreRecuperation: 'We will email you a link.',
    identifiantsRefuses: 'Wrong email or password.',
    inscriptionFaite: 'Account created. Check your inbox to confirm.',

    mesColis: 'My packages', aucunColis: 'No packages yet',
    aucunColisDetail: 'As soon as Speed Express registers a package in your name, it shows up here.',
    rechercherColis: 'Number, description, sender',
    poids: 'Weight', destination: 'Destination', expediteur: 'Sender',
    destinataire: 'Recipient', valeur: 'Declared value',
    parcours: 'Journey', misAJour: 'Updated', enregistreLe: 'Registered on',
    aucunResultat: 'No package matches',
    etape: 'Step', surQuatre: 'of 4',
    suivi: 'Tracking', numColis: 'Tracking number', copierNumero: 'Copy number',
    recents: 'Recent shipments',
    statut: 'Status', de: 'From', vers: 'To', suiviEnDirect: 'Live tracking',

    confirme: 'Confirmed', expedie: 'Shipped', disponible: 'Available',
    livre: 'Delivered', action: 'Action required',

    mesFactures: 'My invoices', aucuneFacture: 'No invoices',
    aucuneFactureDetail: 'Your invoices will appear here with the first billed package.',
    facture: 'Invoice', montant: 'Amount', paye: 'Paid', balance: 'Balance',
    payee: 'Paid', impayee: 'Unpaid', echeance: 'Due',
    totalColis: 'Packages total', fraisService: 'Service fee',
    grandTotal: 'Grand total', detail: 'Details', quantite: 'Qty',
    aRegler: 'To pay', toutEstRegle: 'All settled',

    profil: 'Profile', monCompte: 'My account', identifiant: 'Customer ID',
    langue: 'Language', notifications: 'Notifications',
    notificationsDetail: 'Get alerted when a package changes status',
    changerMotDePasse: 'Change password',
    nouveauMotDePasse: 'New password', motDePasseChange: 'Password changed',
    seDeconnecter: 'Sign out', profilEnregistre: 'Profile saved',
    adresse: 'Address', ville: 'City', pays: 'Country',
    aide: 'Help and contact', ecrireWhatsApp: 'Message on WhatsApp', appeler: 'Call',
    version: 'Version',
  },

  es: {
    app: 'Speed Express', reessayer: 'Reintentar', chargement: 'Cargando…',
    fermer: 'Cerrar', enregistrer: 'Guardar', annuler: 'Cancelar',
    erreurGenerale: 'Ocurrió un error. Inténtelo de nuevo en un momento.',
    horsLigne: 'Sin conexión. Ve los datos de su última visita.',
    copie: 'Copiado',

    bonjour: 'Bienvenido de nuevo', sousTitreConnexion: 'Siga sus paquetes en vivo.',
    connectezCompte: 'Inicie sesión en su cuenta Speed Express',
    emailRequis: 'Introduzca primero su correo electrónico.',
    email: 'Correo electrónico', motDePasse: 'Contraseña',
    seConnecter: 'Iniciar sesión', creerCompte: 'Crear cuenta',
    pasDeCompte: '¿Aún no tiene cuenta?', dejaUnCompte: '¿Ya tiene una cuenta?',
    motDePasseOublie: '¿Olvidó su contraseña?',
    nomComplet: 'Nombre completo', telephone: 'Teléfono',
    lienEnvoye: 'Si esa dirección existe, el enlace ya salió.',
    envoyerLien: 'Enviar el enlace',
    recuperation: 'Recuperación', sousTitreRecuperation: 'Le enviamos un enlace por correo.',
    identifiantsRefuses: 'Correo o contraseña incorrectos.',
    inscriptionFaite: 'Cuenta creada. Revise su correo para confirmar.',

    mesColis: 'Mis paquetes', aucunColis: 'Aún no hay paquetes',
    aucunColisDetail: 'En cuanto Speed Express registre un paquete a su nombre, aparecerá aquí.',
    rechercherColis: 'Número, descripción, remitente',
    poids: 'Peso', destination: 'Destino', expediteur: 'Remitente',
    destinataire: 'Destinatario', valeur: 'Valor declarado',
    parcours: 'Recorrido', misAJour: 'Actualizado', enregistreLe: 'Registrado el',
    aucunResultat: 'Ningún paquete coincide',
    etape: 'Etapa', surQuatre: 'de 4',
    suivi: 'Seguimiento', numColis: 'N.º de seguimiento', copierNumero: 'Copiar el número',
    recents: 'Envíos recientes',
    statut: 'Estado', de: 'De', vers: 'A', suiviEnDirect: 'Seguimiento en vivo',

    confirme: 'Confirmado', expedie: 'Enviado', disponible: 'Disponible',
    livre: 'Entregado', action: 'Acción requerida',

    mesFactures: 'Mis facturas', aucuneFacture: 'Sin facturas',
    aucuneFactureDetail: 'Sus facturas aparecerán aquí con el primer paquete facturado.',
    facture: 'Factura', montant: 'Importe', paye: 'Pagado', balance: 'Saldo',
    payee: 'Pagada', impayee: 'Pendiente', echeance: 'Vencimiento',
    totalColis: 'Total paquetes', fraisService: 'Cargo por servicio',
    grandTotal: 'Total general', detail: 'Detalle', quantite: 'Cant.',
    aRegler: 'Por pagar', toutEstRegle: 'Todo pagado',

    profil: 'Perfil', monCompte: 'Mi cuenta', identifiant: 'Identificador de cliente',
    langue: 'Idioma', notifications: 'Notificaciones',
    notificationsDetail: 'Avisarme cuando un paquete cambie de estado',
    changerMotDePasse: 'Cambiar contraseña',
    nouveauMotDePasse: 'Nueva contraseña', motDePasseChange: 'Contraseña modificada',
    seDeconnecter: 'Cerrar sesión', profilEnregistre: 'Perfil guardado',
    adresse: 'Dirección', ville: 'Ciudad', pays: 'País',
    aide: 'Ayuda y contacto', ecrireWhatsApp: 'Escribir por WhatsApp', appeler: 'Llamar',
    version: 'Versión',
  },

  ht: {
    app: 'Speed Express', reessayer: 'Eseye ankò', chargement: 'Ap chaje…',
    fermer: 'Fèmen', enregistrer: 'Anrejistre', annuler: 'Anile',
    erreurGenerale: 'Gen yon pwoblèm. Eseye ankò nan yon ti moman.',
    horsLigne: 'Pa gen koneksyon. W ap wè done dènye vizit ou a.',
    copie: 'Kopye',

    bonjour: 'Byenveni ankò', sousTitreConnexion: 'Swiv kolis ou yo an dirèk.',
    connectezCompte: 'Konekte nan kont Speed Express ou',
    emailRequis: 'Antre adrès imèl ou anvan.',
    email: 'Adrès imèl', motDePasse: 'Modpas',
    seConnecter: 'Konekte', creerCompte: 'Kreye yon kont',
    pasDeCompte: 'Ou poko gen kont ?', dejaUnCompte: 'Ou gen yon kont deja ?',
    motDePasseOublie: 'Ou bliye modpas ou ?',
    nomComplet: 'Non konplè', telephone: 'Telefòn',
    lienEnvoye: 'Si adrès sa a egziste, yon lyen fèk pati.',
    envoyerLien: 'Voye lyen an',
    recuperation: 'Rekiperasyon', sousTitreRecuperation: 'N ap voye yon lyen pa imèl.',
    identifiantsRefuses: 'Adrès oswa modpas pa kòrèk.',
    inscriptionFaite: 'Kont kreye. Tcheke imèl ou pou konfime.',

    mesColis: 'Kolis mwen yo', aucunColis: 'Poko gen kolis',
    aucunColisDetail: 'Depi Speed Express anrejistre yon kolis nan non ou, l ap parèt isit la.',
    rechercherColis: 'Nimewo, deskripsyon, moun ki voye a',
    poids: 'Pwa', destination: 'Destinasyon', expediteur: 'Moun ki voye',
    destinataire: 'Moun k ap resevwa', valeur: 'Valè deklare',
    parcours: 'Pakou', misAJour: 'Mete ajou', enregistreLe: 'Anrejistre le',
    aucunResultat: 'Pa gen kolis ki koresponn',
    etape: 'Etap', surQuatre: 'sou 4',
    suivi: 'Swivi', numColis: 'Nimewo swivi', copierNumero: 'Kopye nimewo a',
    recents: 'Dènye anbwa yo',
    statut: 'Estati', de: 'Soti', vers: 'Ale', suiviEnDirect: 'Swivi an dirèk',

    confirme: 'Konfime', expedie: 'Voye', disponible: 'Disponib',
    livre: 'Livre', action: 'Aksyon nesesè',

    mesFactures: 'Fakti mwen yo', aucuneFacture: 'Pa gen fakti',
    aucuneFactureDetail: 'Fakti ou yo ap parèt isit la ak premye kolis ki fakture a.',
    facture: 'Fakti', montant: 'Montan', paye: 'Peye', balance: 'Balans',
    payee: 'Peye', impayee: 'Poko peye', echeance: 'Dat limit',
    totalColis: 'Total kolis', fraisService: 'Frè sèvis',
    grandTotal: 'Gran total', detail: 'Detay', quantite: 'Kantite',
    aRegler: 'Pou peye', toutEstRegle: 'Tout bagay peye',

    profil: 'Pwofil', monCompte: 'Kont mwen', identifiant: 'Idantifyan kliyan',
    langue: 'Lang', notifications: 'Notifikasyon',
    notificationsDetail: 'Avèti m lè yon kolis chanje estati',
    changerMotDePasse: 'Chanje modpas',
    nouveauMotDePasse: 'Nouvo modpas', motDePasseChange: 'Modpas chanje',
    seDeconnecter: 'Dekonekte', profilEnregistre: 'Pwofil anrejistre',
    adresse: 'Adrès', ville: 'Vil', pays: 'Peyi',
    aide: 'Èd ak kontak', ecrireWhatsApp: 'Ekri sou WhatsApp', appeler: 'Rele',
    version: 'Vèsyon',
  },
} as const;

export type Cle = keyof (typeof textes)['fr'];
export default textes;
