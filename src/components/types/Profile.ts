
export interface AlbumFormState {
    title: string;
    releaseDate: string;
    cover: File | null;
    preview: string;
}

export interface Track {
    id: string;
    title: string;
    coverUrl?: string;
    genre: string;
    playCount: number;
    duration: number;
}

export interface Album {
    id: string;
    title: string;
    coverUrl?: string;
    trackCount?: number;
}