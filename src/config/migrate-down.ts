import { migrator } from "./migrator.js";

try {
    await migrator.down();

    console.log("Migration down successfully");
} catch (error) {
    console.error("Error reverting migration:", error);
    process.exit(1);
}
