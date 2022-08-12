import {Subtask} from "../types/dataTypes";

export const isMobileDevice = () => {
    const agent = (navigator?.userAgent || '').toLowerCase();
    const mobileDevices = ['iphone', 'ipad', 'opera mini', 'android'];
    for (let device of mobileDevices) {
        if (agent && agent.includes(device)) {
            return true;
        }
    }
}

export const getDoneSubtasks = (subtasks: Subtask[]) => {
    const doneSubtasks = subtasks.filter(s => s.done);
    return `${doneSubtasks.length} of ${subtasks.length}`
}

export function deepCloneOfItem<T>(item: T) {
    return JSON.parse(JSON.stringify(item));
}
