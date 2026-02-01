import { Career } from "../../types/Career";

type Props = {
  careers: Career[];
  onSelect: (c: Career) => void;
};

export default function CareersGrid({ careers, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {careers.map((carrera) => (
        <div
          key={carrera.id}
          className="p-6 bg-gray-50 rounded-xl cursor-pointer hover:shadow"
          onClick={() => onSelect(carrera)}
        >
          <h3 className="text-lg font-bold">{carrera.nombre}</h3>

          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {carrera.descripcion}
          </p>

          <div className="flex gap-2 mt-3 text-xs text-gray-500">
            <span>{carrera.area}</span>
            <span>•</span>
            <span>{carrera.duracion}</span>
          </div>

          {carrera.matchIA && (
            <div className="mt-2 text-sm font-bold text-blue-600">
              Match IA: {carrera.matchIA}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
