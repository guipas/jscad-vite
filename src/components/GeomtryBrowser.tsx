import { finalFirst } from "../utils";

interface GeometryBrowserProps {
  geometries: GeomTree;
  onChange: (geometries: Record<string, boolean>) => void;
  className?: string;
}

export type GeomTree = Record<string, boolean>;

export function GeometryBrowser({
  geometries,
  onChange,
  className,
}: GeometryBrowserProps) {
  return (
    <div className={`m-2 p-4 border border-gray-500 rounded ${className}`}>
      {Object.keys(geometries)
        .sort(finalFirst)
        .map((key) => {
          return (
            <Item
              key={key}
              name={key}
              value={geometries[key] as boolean}
              onChange={(value) => onChange({ ...geometries, [key]: value })}
            />
          );
        })}
    </div>
  );
}

interface ItemProps {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function Item({ name, value, onChange }: ItemProps) {
  return (
    <div
      className="flex items-center text-white cursor-pointer py-2 border-b border-gray-500 last:border-b-0 first:font-bold"
      onClick={() => onChange(!value)}
    >
      <input type="checkbox" checked={value} />
      <label className="ml-2">{name}</label>
    </div>
  );
}
