import type { MyTaskRow } from '../../../types/myTasks';

interface TaskGroup {
    label: string;
    icon?: string;
    tasks: MyTaskRow[];
}

export default function groupByDate(tasks: MyTaskRow[]): TaskGroup[] {
    const today: MyTaskRow[] = [],
        thisWeek: MyTaskRow[] = [],
        nextWeek: MyTaskRow[] = [],
        completed: MyTaskRow[] = [],
        noDate: MyTaskRow[] = [];
    tasks.forEach((t) => {
        if (t.status === 'COMPLETE') completed.push(t);
        else if (t.due_date === 'Today') today.push(t);
        else if (t.due_date?.includes('Oct 2') || t.due_date?.includes('Oct 3')) thisWeek.push(t);
        else if (
            t.due_date?.includes('Oct 3') ||
            t.due_date?.includes('Nov') ||
            t.due_date?.includes('Mon') ||
            t.due_date?.includes('Tue')
        )
            nextWeek.push(t);
        else if (!t.due_date) noDate.push(t);
        else thisWeek.push(t);
    });
    const groups: TaskGroup[] = [];
    if (today.length) groups.push({ label: '📌 Today', tasks: today });
    if (thisWeek.length) groups.push({ label: '📅 This Week', tasks: thisWeek });
    if (nextWeek.length) groups.push({ label: '📆 Next Week', tasks: nextWeek });
    if (noDate.length) groups.push({ label: '📋 No date', tasks: noDate });
    if (completed.length) groups.push({ label: '✅ Completed', tasks: completed });
    return groups;
}
