import Dexie from 'dexie';
//import relationships from 'dexie-relationships';
//{addons: [relationships]}

export const db = new Dexie('codetrain-guest');
db.version(1).stores({
    courses: '++id, ipfs, title, enrolled',
    learning_unit: '++id, courseId -> courses.id, title, url, sectionNum, unitNum, completed'
});
db.version(2).stores({
    bookmarks: '++id, unitId -> learning_unit.id'
});
