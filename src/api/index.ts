import request from "./axios";
import { Archetypes, Ranked } from "@/models";
import { Mode } from "@/constants";
export const getArchetypes = async (mode: Mode) => {
  return await request<Ranked<Archetypes[]>>(
    `/archetypes/getArchetypes?mode=${mode}`
  );
};
