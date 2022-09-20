import { atom } from 'recoil';

export const userActivity = atom({
    key: 'userActivity',
    default: false,
});