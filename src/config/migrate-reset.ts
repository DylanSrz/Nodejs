import { migrator } from "./migrator.js";

try {
    await migrator.down({ to: 0 });

    console.log("Todas las migraciones fueron revertidas correctamente.");
} catch (error) {
    console.error("Error revirtiendo las migraciones:", error);
    process.exit(1);
}
