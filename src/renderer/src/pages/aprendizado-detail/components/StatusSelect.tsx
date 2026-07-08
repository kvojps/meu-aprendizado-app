import { CheckCircle, PendingActions, RadioButtonUnchecked } from '@mui/icons-material';
import {
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import type { StatusNoAprendizado } from '@shared/types/noAprendizado';
import { statusNoOptions } from '@/hooks/nos/noSchema';

const STATUS_ICONS: Record<StatusNoAprendizado, typeof CheckCircle> = {
  nao_iniciado: RadioButtonUnchecked,
  em_andamento: PendingActions,
  concluido: CheckCircle,
};

function iconColor(color: (typeof statusNoOptions)[number]['color']) {
  return color === 'default' ? 'disabled' : color;
}

interface StatusSelectProps {
  status: StatusNoAprendizado;
  onChange: (status: StatusNoAprendizado) => void;
}

export function StatusSelect({ status, onChange }: StatusSelectProps) {
  function handleChange(event: SelectChangeEvent) {
    onChange(event.target.value as StatusNoAprendizado);
  }

  return (
    <Select
      size="small"
      value={status}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      variant="standard"
      disableUnderline
      renderValue={(value) => {
        const option = statusNoOptions.find((o) => o.value === value) ?? statusNoOptions[0];
        const Icon = STATUS_ICONS[option.value];
        return (
          <Tooltip title={option.label}>
            <Icon fontSize="small" color={iconColor(option.color)} />
          </Tooltip>
        );
      }}
      sx={{ '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' } }}
    >
      {statusNoOptions.map((option) => {
        const Icon = STATUS_ICONS[option.value];
        return (
          <MenuItem key={option.value} value={option.value}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Icon fontSize="small" color={iconColor(option.color)} />
              <Typography variant="body2">{option.label}</Typography>
            </Stack>
          </MenuItem>
        );
      })}
    </Select>
  );
}
