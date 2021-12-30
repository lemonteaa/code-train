import Dexie from 'dexie';
//import relationships from 'dexie-relationships';
//{addons: [relationships]}

export const db = new Dexie('codetrain-guest');
/*db.version(1).stores({
    courses: '++id, ipfs, title, enrolled',
    learning_unit: '++id, courseId -> courses.id, title, url, sectionNum, unitNum, completed'
});
db.version(2).stores({
    bookmarks: '++id, unitId -> learning_unit.id'
});*/

// Specify the index (non-index field mentioned in comment)
// Quick revision: first field is primary key. ++ for auto-increment, 
// [] for composite index, & for uniquness constraint,
// index can be used for sorting
db.version(1).stores({
    courses: 'ipfscid', // { title, enrolled }
    learningunit: '[ipfscid+sectionNum+unitNum], [sectionNum+unitNum]' // { title, url, completed, timeest }
});
db.version(2).stores({
    bookmarks: '++id, &[ipfscid+sectionNum+unitNum]'
});
//Let's keep it simple and put the goal items as subobject for now
db.version(5).stores({
    dailygoals: '++id, [endDT+startDT], endDT' // { items: [{ ipfscid, sectionNum, unitNum, completed }] }
})
