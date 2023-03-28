import { type Note } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "~/utils/api";
import {
  currentNoteIdAtom,
  editLoadingAtom,
  eidtingNoteAtom,
  onEditAtom,
} from "~/utils/store";

export const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [onEdit, setOnEdit] = useAtom(onEditAtom);
  const [, setEditNote] = useAtom(eidtingNoteAtom);
  const [, setEditLoading] = useAtom(editLoadingAtom);
  const [, setCurrentNoteId] = useAtom(currentNoteIdAtom);

  const { refetch } = api.note.getSpecific.useQuery(
    {
      id: note?.id ?? "",
    },
    {
      enabled: false,
      onSuccess: (data) => {
        setEditNote(data);
      },
    }
  );

  const handleEdit = () => {
    setCurrentNoteId(note.id);
    setEditLoading(true);
    setOnEdit((prev) => !prev);
  };

  useEffect(() => {
    if (onEdit) void refetch().then(() => setEditLoading(false));
  }, [onEdit, refetch, setEditLoading]);

  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body m-0 p-3">
        <div
          className={`collapse-arrow ${
            isExpanded ? "collapse-open" : ""
          } collapse`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="collapse-title text-xl font-bold">{note.title}</div>
          <div className="collapse-content">
            <article className="prose lg:prose-xl">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </div>
        </div>
        <div className="card-actions mx-2 flex justify-end">
          <button onClick={handleEdit} className="btn-primary btn-xs btn px-5">
            Edit
          </button>
          <button className="btn-warning btn-xs btn px-5" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
