import { createDatabase, users, projects, tasks, comments, taskAssignees, labels, taskLabels } from './schema';

async function migrate() {
    const db = await createDatabase();

    await db.createTable(users).ifNotExists();
    await db.createTable(projects).ifNotExists();
    await db.createTable(tasks).ifNotExists();
    await db.createTable(comments).ifNotExists();
    await db.createTable(taskAssignees).ifNotExists();
    await db.createTable(labels).ifNotExists();
    await db.createTable(taskLabels).ifNotExists();

    console.log('Migration completed');
    process.exit(0);
}

migrate().catch((err) => {
    console.error('Migration failed', err);
    process.exit(1);
});
