import { List } from "./list.model";

export interface Card {
    id: string;
    title: string;
    description?: string;
    position: number;
    list: List;
}

// export interface CreateCardDto {
//     title: string;
//     descripcion?: string;
//     position: number;
//     listId: string;
//     boadId: string;
// }

export interface CreateCardDto extends Partial<Omit<Card, 'id' | 'list'>>{
    listId: string;
    boardId: string;
}
// export interface CardDto extends Partial<Omit<Card, 'id' | 'updatedAt' | 'creationAt'>>{}

export interface CardDto {
    title?: string;
    description?: string;
    position?: number;
    listId?: string;
    boardId?: string;
}
