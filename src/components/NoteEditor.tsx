import { useEffect, useState } from "react";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import CodeMirror from "@uiw/react-codemirror";
import { useAtom } from "jotai";
import {
  currentNoteIdAtom,
  editLoadingAtom,
  eidtingNoteAtom,
  onEditAtom,
} from "~/utils/store";

export const NoteEditor = ({
  onSave,
  onUpdate,
}: {
  onSave: (note: { title: string; content: string }) => void;
  onUpdate: (note: { id: string; title: string; content: string }) => void;
}) => {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [onEdit, setOnEdit] = useAtom(onEditAtom);
  const [editNote] = useAtom(eidtingNoteAtom);
  const [editLoading] = useAtom(editLoadingAtom);
  const [currentNoteId] = useAtom(currentNoteIdAtom);

  const [onUpdateNote, setOnUpdateNote] = useState<boolean>(false);

  const clearInput = () => {
    setTitle("");
    setCode("");
  };

  useEffect(() => {
    if (onEdit && editNote) {
      if (!editLoading) {
        setTitle(editNote.title);
        setCode(editNote.content);
      }
    } else {
      clearInput();
    }
  }, [onEdit, editNote, editLoading]);

  const handleSubmit = () => {
    if (onEdit) {
      setOnUpdateNote(true);
      onUpdate({
        id: currentNoteId,
        title,
        content: code,
      });
      setOnEdit(false);
      clearInput();
    } else {
      onSave({
        title,
        content: code,
      });
      clearInput();
    }
  };

  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            type="text"
            placeholder="Note title"
            className="input-primary input input-lg w-full font-bold"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(value) => setCode(value)}
          className="border border-gray-300"
        />
      </div>
      <div className="card-actions justify-end">
        <button
          onClick={handleSubmit}
          className="btn-primary btn"
          disabled={title.trim().length === 0 || code.trim().length === 0}
        >
          {onEdit ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};
