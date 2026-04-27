import type { TaskWithSpaceData } from '@/store/modules/tasks';

interface TaskGroup {
    label: string;
    icon?: string;
    tasks: TaskWithSpaceData[];
}

export default function groupByDate(tasks: TaskWithSpaceData[]): TaskGroup[] {
    const isComplete = (task: TaskWithSpaceData) => {
        return (task.status_name ?? '').toUpperCase() === 'COMPLETE' || !!task.completed_at;
    };

    const toDateOnly = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const parseDueDate = (dueDate: string | null): Date | null => {
        if (!dueDate) return null;
        if (dueDate === 'Today') return toDateOnly(new Date());
        if (dueDate === 'Tomorrow') {
            const d = toDateOnly(new Date());
            d.setDate(d.getDate() + 1);
            return d;
        }
        const parsed = new Date(dueDate);
        return Number.isNaN(parsed.getTime()) ? null : toDateOnly(parsed);
    };

    const todayDate = toDateOnly(new Date());
    const thisWeekEnd = new Date(todayDate);
    thisWeekEnd.setDate(todayDate.getDate() + (7 - todayDate.getDay()));
    const nextWeekEnd = new Date(thisWeekEnd);
    nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);

    const today: TaskWithSpaceData[] = [],
        thisWeek: TaskWithSpaceData[] = [],
        nextWeek: TaskWithSpaceData[] = [],
        completed: TaskWithSpaceData[] = [],
        noDate: TaskWithSpaceData[] = [];

    tasks.forEach((t) => {
        if (isComplete(t)) {
            completed.push(t);
            return;
        }

        const due = parseDueDate(t.due_date);
        if (!due) {
            noDate.push(t);
            return;
        }

        if (due.getTime() <= todayDate.getTime()) {
            today.push(t);
            return;
        }

        if (due.getTime() <= thisWeekEnd.getTime()) {
            thisWeek.push(t);
            return;
        }

        if (due.getTime() <= nextWeekEnd.getTime()) {
            nextWeek.push(t);
            return;
        }

        nextWeek.push(t);
    });

    const groups: TaskGroup[] = [];
    if (today.length) groups.push({ label: '📌 Today', tasks: today });
    if (thisWeek.length) groups.push({ label: '📅 This Week', tasks: thisWeek });
    if (nextWeek.length) groups.push({ label: '📆 Next Week', tasks: nextWeek });
    if (noDate.length) groups.push({ label: '📋 No date', tasks: noDate });
    if (completed.length) groups.push({ label: '✅ Completed', tasks: completed });
    return groups;
}
