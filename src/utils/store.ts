import { type Note } from "@prisma/client";
import { atom } from "jotai";

export const onEditAtom = atom<boolean>(false);
export const eidtingNoteAtom = atom<Note | null>(null);

export const editLoadingAtom = atom<boolean>(true);

export const currentNoteIdAtom = atom<string>("");
