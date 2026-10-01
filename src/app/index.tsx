/* Point d'entrée : l'aiguillage de _layout.tsx décide tout de suite où
   envoyer le client. Cet écran n'est jamais vu. */
import { Redirect } from 'expo-router';
export default function Entree() { return <Redirect href="/connexion" />; }
