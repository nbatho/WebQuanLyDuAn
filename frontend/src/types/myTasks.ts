import type { Task } from './tasks';

/** Task row plus joined space display fields (mirrors `tasks` + `spaces.name`). */
export interface MyTaskRow extends Task {
    space_name: string;
    space_color: string;
}
