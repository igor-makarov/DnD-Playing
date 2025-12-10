/**
 * Registry for rehydratable classes.
 * Import this file to ensure all rehydratable classes are registered
 * before calling rehydrate().
 */
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";

import { registerRehydratable } from "./rehydratable";

registerRehydratable("DiceString", DiceString);
registerRehydratable("D20Test", D20Test);
