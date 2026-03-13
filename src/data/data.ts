// src/data/data.ts

import im from "../assets/OIP.webp";
import im1 from "../assets/t2.webp";
import im2 from "../assets/baky.webp";
import im3 from "../assets/t.webp";
import im4 from "../assets/toby.webp";

// Type pour structurer une musique
export interface Music {
  id: number;
  title: string;
  artist: string;
  album?: string;
  description?: string;
  cover: string;
  src: string;
  type: "playlist" | "radio" | "track";
}

type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string; // format mm:ss
  cover?: string;
  src:string;
};
// Playlists
export const playlists: Music[] = [
  {
    id: 1,
    title: "Chill Vibes",
    artist: "Various Artists",
    description: "Ambiance douce et détendue.",
    cover: im,
    src: "",
    type: "playlist",
  },
 
];
export const TRACKS: Track[] = [
  { id: 1, title: "M'vle Avèw", artist: "Baky", album: "M'vle Avèw", duration: "3:13", cover: im ,src:""},
  { id: 2, title: "Riviè", artist: "Teddy Hashtag", album: "Riviè EP", duration: "2:45", cover:im1 ,src:""},
  { id: 3, title: "Nuit De Ville", artist: "Troubleboy", album: "City Vibes", duration: "4:02", cover:im2 ,src:''},
  { id: 4, title: "Zouk Flow", artist: "Hitmaker", album: "Summer 20", duration: "3:28", cover: im3 ,src:""},
  { id: 5, title: "Bèl Jou", artist: "Baky", album: "M'vle Avèw", duration: "3:01", cover: im4,src:""},
  // ajoute autant de pistes que tu veux
];
// Radios
export const radios: Music[] = [
  {
    id: 10,
    title: "Barikad Crew",
    artist: "Izolan, Blaze One, Wendy King",
    description: "Le meilleur du rap haïtien.",
    cover: im,
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes_Music/Corporate__Motivational_Music/Scott_Holmes_Music_-_07_-_Happy_Clappy.mp3",
    type: "radio",
  },
  {
    id: 11,
    title: "Kenny Haiti",
    artist: "Medjy, Enposib, Roody Roodboy",
    description: "Un mix exclusif de sons haïtiens.",
    cover: im1,
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequencies/Ketsa_-_07_-_Mission.mp3",
    type: "radio",
  },
  {
    id: 12,
    title: "Baky",
    artist: "Rap Kreyol",
    description: "Les meilleurs titres de Baky.",
    cover: im2,
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Lobo_Loco/Waiting_for_the_Moon/Lobo_Loco_-_01_-_Fairy_Lights_ID_1183.mp3",
    type: "radio",
  },
  {
    id: 13,
    title: "Toby",
    artist: "Trap & Afro",
    description: "Sélection des hits de Toby.",
    cover: im4,
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequencies/Ketsa_-_05_-_Blessed_Times.mp3",
    type: "radio",
  },
  {
    id: 14,
    title: "Toby",
    artist: "Trap & Afro",
    description: "Sélection des hits de Toby.",
    cover: im3,
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequencies/Ketsa_-_05_-_Blessed_Times.mp3",
    type: "radio",
  },
];

// Tracks (musiques individuelles)
export const Music: Music[] = [
  {
    id: 20,
    title: "Ou Ale",
    artist: "Baky",
    album: "Rap Kreyol",
    description: "Un classique incontournable du rap haïtien.",
    cover: im2,
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Komiku/Its_time_for_adventure_/Komiku_-_06_-_Friends.mp3",
    type: "track",
  },
  {
    id: 21,
    title: "Mwen La",
    artist: "Roody Roodboy",
    album: "Kompa & Rap",
    description: "Un son qui mélange énergie et émotion.",
    cover: im3,
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Tales_of_Japanese_Folk_Villages/Komiku_-_07_-_Mountain_Kami.mp3",
    type: "track",
  },
  {
    id: 22,
    title: "Lan Nuit",
    artist: "Wendy",
    album: "Trap Kreyol",
    description: "Une vibe sombre et puissante.",
    cover: im1,
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Its_time_for_adventure_/Komiku_-_01_-_Chasing_Villagers.mp3",
    type: "track",
  },
  {
    id: 23,
    title: "Fanm Se Dous",
    artist: "Kenny Haiti",
    album: "Love & Kompa",
    description: "Un hit romantique qui fait vibrer.",
    cover: im4,
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequencies/Ketsa_-_02_-_Rising.mp3",
    type: "track",
  },
  {
    id: 24,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    description: "Un des plus grands hits mondiaux.",
    cover: "https://i.scdn.co/cover/ab67616d0000b273b8e3c46b8bb58a19f2b8f0a3",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Komiku/Its_time_for_adventure_/Komiku_-_04_-_Trek.mp3",
    type: "track",
  },
  {
    id: 25,
    title: "One Dance",
    artist: "Drake ft. Wizkid, Kyla",
    album: "Views",
    description: "Afrobeat & vibes mondiales.",
    cover: "https://i.scdn.co/cover/ab67616d0000b273f4e60a6e9d11a8db7bf67ad0",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Lobo_Loco/Nature_and_Environment/Lobo_Loco_-_02_-_Misty_Forest.mp3",
    type: "track",
  },
];
