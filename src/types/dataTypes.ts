
export interface Board {
    id: string,
    name: string,
    columns: Column[],
    users: string[],
    admins: string[],
}

export interface Column {
    id: string,
    name: string,
    cards: Card[]
}

export interface Card {
    id: string,
    name: string,
    status: string,
    subtasks: Subtask[]
}

export interface Subtask {
    done: boolean,
    id: string,
    task: string
}

export enum Mode {
    EDIT = 'EDIT',
    CREATE = 'CREATE',
    VIEW = 'VIEW'
}

export interface TicketEntity {
    cardId: string,
    subtasks: Subtask[],
    status: string,
    name: string,
    description: string,
    mode: Mode,
    prevColumnId: string,
}

export interface CardUpdateProps {
    currentItem: Card,
    columnId: string,
    dragIndex: number,
    hoverIndex: number,
    currentColumnId: string
}

export interface ColumnCreateProps {
    columnName: string
}

export interface ColumnUpdateProps {
    columnName: string,
    columnId: string
}
