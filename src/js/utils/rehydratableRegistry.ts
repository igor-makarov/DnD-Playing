/**
 * Registry for rehydratable classes.
 * Import this file to ensure all rehydratable classes are registered
 * before calling rehydrate().
 *
 * This is necessary because the @rehydratable decorator registers classes
 * in a module-scoped Map, which must be populated before rehydration can work.
 */
// Import all rehydratable classes to trigger their decorators
import "@/js/common/D20Test";
import "@/js/common/DiceString";
