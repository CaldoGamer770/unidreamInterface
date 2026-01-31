type Props = {
  page: number;
  setPage: (p: number) => void;
};

export default function Pagination({ page, setPage }: Props) {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        className="px-4 py-2 rounded bg-gray-200"
      >
        Anterior
      </button>

      <span className="font-bold">Página {page}</span>

      <button
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 rounded bg-gray-200"
      >
        Siguiente
      </button>
    </div>
  );
}
