let counter = 100;

export function nextTaskId(): number {
    counter += 1;
    return counter;
}
