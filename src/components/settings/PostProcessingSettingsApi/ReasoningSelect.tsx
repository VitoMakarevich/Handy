import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ReasoningEffort } from "@/bindings";
import { Dropdown, type DropdownOption } from "../../ui/Dropdown";

const REASONING_EFFORTS: ReasoningEffort[] = [
  "auto",
  "omit",
  "none",
  "minimal",
  "low",
  "medium",
  "high",
];

interface ReasoningSelectProps {
  value: ReasoningEffort;
  onChange: (value: ReasoningEffort) => void;
  disabled?: boolean;
}

export const ReasoningSelect: React.FC<ReasoningSelectProps> = React.memo(
  ({ value, onChange, disabled }) => {
    const { t } = useTranslation();

    const options = useMemo<DropdownOption[]>(
      () =>
        REASONING_EFFORTS.map((effort) => ({
          value: effort,
          label: t(`settings.postProcessing.api.reasoning.options.${effort}`),
        })),
      [t],
    );

    return (
      <Dropdown
        options={options}
        selectedValue={value}
        onSelect={(selected) => onChange(selected as ReasoningEffort)}
        disabled={disabled}
        className="flex-1"
      />
    );
  },
);

ReasoningSelect.displayName = "ReasoningSelect";
