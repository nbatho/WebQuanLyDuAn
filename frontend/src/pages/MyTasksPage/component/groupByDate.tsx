interface Task {
    id: string;
    title: string;
    status: string;
    statusColor: string;
    priority: string;
    priorityColor: string;
    dueDate: string | null;
    space: string;
    spaceColor: string;
    comments: number;
    assignees: string[];
    description?: string;
    subtasks: any[];
}


interface TaskGroup {
    label: string;
    icon?: string;
    tasks: Task[];
}


export default function groupByDate(tasks: Task[]): TaskGroup[] {
    const today: Task[] = [], thisWeek: Task[] = [], nextWeek: Task[] = [], completed: Task[] = [], noDate: Task[] = [];
    tasks.forEach(t => {
        if (t.status === 'COMPLETE') completed.push(t);
        else if (t.dueDate === 'Today') today.push(t);
        else if (t.dueDate?.includes('Oct 2') || t.dueDate?.includes('Oct 3')) thisWeek.push(t);
        else if (t.dueDate?.includes('Oct 3') || t.dueDate?.includes('Nov') || t.dueDate?.includes('Mon') || t.dueDate?.includes('Tue')) nextWeek.push(t);
        else if (!t.dueDate) noDate.push(t);
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