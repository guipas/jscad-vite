import { GeometrySettings, GeometriesTreeSettings } from "../../types";
import { finalFirst, isGeoSetting } from "../../utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GeometryBrowserProps {
  settings: GeometriesTreeSettings;
  onChangeSettings: (geometries: GeometriesTreeSettings) => void;
  className?: string;
  onClearSettings: () => void;
}

export function GeometryBrowser({
  settings: geometries,
  onChangeSettings,
  className,
  onClearSettings,
}: GeometryBrowserProps) {
  return (
    <div
      className={`m-2 border border-gray-500 rounded text-white ${className}`}
    >
      <div className="text-left text-sm p-2 border-b border-gray-500 flex items-center">
        Objects Browser
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto">
            <i className="bi bi-three-dots-vertical ml-auto"></i>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onClearSettings()}>
              Clear Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="px-4">
        <RecursiveItem
          settings={geometries}
          onChange={(value) =>
            onChangeSettings(value as GeometriesTreeSettings)
          }
        />
      </div>
    </div>
  );
}

interface ItemProps {
  name: string;
  settings: GeometrySettings;
  onChange: (settings: GeometrySettings) => void;
}

function Item({ name, settings, onChange }: ItemProps) {
  return (
    <div className="flex items-center text-white cursor-pointer py-2 border-b border-gray-500 last:border-b-0 first:font-bold">
      <div
        className=" flex items-center"
        onClick={() => onChange({ ...settings, visible: !settings.visible })}
      >
        <input type="checkbox" checked={settings.visible} />
        <label className="ml-2">{name}</label>
      </div>
      <button
        type="button"
        className="ml-2"
        onClick={() =>
          onChange({ ...settings, transparent: !settings.transparent })
        }
      >
        <i
          className={`bi bi-transparency ${
            settings.transparent ? "text-white" : "opacity-50"
          }`}
        ></i>
      </button>
    </div>
  );
}

interface RecursiveItemProps<S = GeometriesTreeSettings | GeometrySettings> {
  settings: S;
  onChange: (geometries: S) => void;
  path?: string[];
  index?: number;
}

function RecursiveItem({
  settings,
  onChange,
  path = [],
  index = 0,
}: RecursiveItemProps) {
  if (isGeoSetting(settings)) {
    return (
      <div className="">
        <Item
          name={path.slice(-1)?.[0]}
          // name={path.join(".")}
          settings={settings}
          onChange={(s) => onChange(s)}
        />
      </div>
    );
  } else {
    const name = path.slice(-1)?.[0];
    return (
      <div className={index === 0 ? "" : ""}>
        {index > 0 && (
          <div className="flex items-center text-white cursor-pointer py-1 ">
            {/* {index > 1 && (
              <i className="bi bi-chevron-left -rotate-45 mr-2"></i>
            )} */}
            <div className="">{name}</div>
          </div>
        )}
        <div className={index === 0 ? "" : "ml-4"}>
          {Object.keys(settings)
            .sort(finalFirst)
            .map((key) => (
              <RecursiveItem
                key={key}
                index={index + 1}
                path={[...path, key]}
                settings={settings[key]}
                onChange={(value) => {
                  onChange({
                    ...settings,
                    [key]: value,
                  });
                }}
              />
            ))}
        </div>
      </div>
    );
  }
}
