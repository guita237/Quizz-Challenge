export interface Player {
  id?: number;
  name: string;
  birthDate?: string;
  games?: any[];
}

export interface CreatePlayerRequest {
  name: string;
}

export interface CreatePlayerResponse {
  id: number;
  name: string;
  birthDate?: string;
}
