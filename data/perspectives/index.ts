import { developerData } from "./developer"
import { leaderData } from "./leader"
import { mlEngineerData } from "./ml-engineer"
import { electricalEngineerData } from "./electrical-engineer"
import type { Perspective } from "@/components/PerspectiveSwitcher"

export const perspectiveData = {
  developer: developerData,
  leader: leaderData,
  "ml-engineer": mlEngineerData,
  "electrical-engineer": electricalEngineerData,
}

export function getPerspectiveData(perspective: Perspective) {
  return perspectiveData[perspective] || developerData
}
