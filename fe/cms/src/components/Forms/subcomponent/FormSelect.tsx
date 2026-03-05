import { SelectComponent } from "@lib/ui";

export interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  options: FormSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  groupLabel: string;
  loading?: boolean;
  emptyText?: string;
  loadingText?: string;
}

export const FormSelect = ({
  options,
  value,
  onValueChange,
  groupLabel,
  loading = false,
  emptyText = "目前沒有可用活動",
  loadingText = "活動載入中...",
}: FormSelectProps) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-violet-300/20 bg-violet-950/40 px-4 py-3 text-sm text-violet-100 animate-pulse">
        {loadingText}
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="rounded-xl border border-red-300/20 bg-red-950/30 px-4 py-3 text-sm text-red-100">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-violet-300/20 bg-black/20 p-1">
      <SelectComponent value={value} onValueChange={onValueChange}>
        <SelectComponent.Group>
          <SelectComponent.Label text={groupLabel} />
          {options.map((option) => {
            return (
              <SelectComponent.Item
                key={`${option.value}-${option.label}`}
                text={option.label}
                value={option.value}
              />
            );
          })}
        </SelectComponent.Group>
      </SelectComponent>
    </div>
  );
};
