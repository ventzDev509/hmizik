
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
    artist: {
        username: string;
        user: {
            name: string,
            profile: {
                name: string;
                customTarif:number;
                payoutThreshold:number
            };
        };

    };

    plays: {
        trackId: string;
        userId: string;
        userIp: string;
        city: string
    }
}

export interface Album {
    id: string;
    title: string;
    coverUrl?: string;
    trackCount?: number;
}