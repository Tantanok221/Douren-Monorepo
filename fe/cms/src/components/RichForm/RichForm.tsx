import { FormImageUploadRef, Forms } from "../Forms";
import { forwardRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { trpc } from "@/lib/trpc";

interface Props {
  label: React.ReactNode;
  formField: string;
}

interface ImageFieldProps {
  multiple?: boolean;
  label: React.ReactNode;
  formField: string;
  title: string;
}

interface EventFieldProps {
  label: string;
  formField: string;
}

export const InputTextField = ({ label, formField }: Props) => {
  return (
    <Forms.Field name={formField}>
      <Forms.HorizontalLayout>
        <Forms.Label>{label}</Forms.Label>
        <Forms.Message />
      </Forms.HorizontalLayout>
      <Forms.Control />
    </Forms.Field>
  );
};

export const TagFilterField = ({ label, formField }: Props) => {
  return (
    <Forms.Field name={formField}>
      <Forms.HorizontalLayout>
        <Forms.Label>{label}</Forms.Label>
        <Forms.Message />
      </Forms.HorizontalLayout>
      <Forms.TagFilter />
    </Forms.Field>
  );
};

export const ImageField = forwardRef<FormImageUploadRef, ImageFieldProps>(
  ({ label, formField, title, multiple }: ImageFieldProps, ref) => {
    const { register } = useFormContext();
    return (
      <Forms.Field name={formField}>
        <Forms.Label>{label}</Forms.Label>
        {/* Hidden input to register field with react-hook-form */}
        <input type="hidden" {...register(formField)} />
        <Forms.ImageUpload
          title={title}
          multiple={multiple}
          formField={formField}
          ref={ref}
        />
      </Forms.Field>
    );
  },
);

export const EventField = ({ label, formField }: EventFieldProps) => {
  const { setValue, watch } = useFormContext();
  const { data, isLoading, error } = trpc.eventArtist.getAllEvent.useQuery();
  const currentValue = watch(formField);
  const options =
    data?.map((item) => {
      return {
        label: item.name,
        value: String(item.id),
      };
    }) ?? [];

  // Keep selection valid whenever event list changes
  useEffect(() => {
    if (!data || data.length === 0) return;

    const hasSelectedValue = data.some((item) => item.id === currentValue);
    if (!currentValue || !hasSelectedValue) {
      setValue(formField, data[0].id, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [data, currentValue, setValue, formField]);

  const onEventFieldChange = (value: string) => {
    setValue(formField, Number(value), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const statusText = isLoading
    ? "活動載入中"
    : options.length === 0
      ? "尚無可選活動"
      : `共 ${options.length} 場活動`;

  const statusClass = isLoading
    ? "border-violet-300/30 bg-violet-500/20 text-violet-50"
    : options.length === 0
      ? "border-red-300/30 bg-red-500/20 text-red-50"
      : "border-emerald-300/30 bg-emerald-500/20 text-emerald-50";

  return (
    <Forms.Field name={formField}>
      <div className="rounded-xl border border-violet-300/25 bg-gradient-to-br from-[#2a1646]/75 via-[#1f1438]/80 to-[#140f25]/85 p-4 shadow-[0_16px_30px_rgba(9,7,19,0.28)]">
        <Forms.HorizontalLayout>
          <Forms.Label>{label}</Forms.Label>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${statusClass}`}
          >
            {statusText}
          </span>
        </Forms.HorizontalLayout>
        <div className="mt-2">
          <Forms.Select
            value={currentValue ? String(currentValue) : undefined}
            onValueChange={onEventFieldChange}
            options={options}
            groupLabel={label}
            loading={isLoading}
            emptyText={"目前沒有可用活動，請先在活動管理新增活動"}
          />
        </div>
        <div className="mt-2 text-xs text-violet-100/80">
          先選擇活動場次，再填寫攤位與位置資訊，避免資料填錯場次。
        </div>
        <div className="mt-1">
          <Forms.Message />
        </div>
        {error ? (
          <div className="mt-1 text-sm text-red-100">
            活動載入失敗，請稍後再試。
          </div>
        ) : null}
      </div>
    </Forms.Field>
  );
};
