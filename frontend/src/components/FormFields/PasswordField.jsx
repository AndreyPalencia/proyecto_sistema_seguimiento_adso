import InputField from './InputField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
import { useState } from 'react';

const PasswordField = ({ control, name, label, startIcon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputField
      name={name}
      label={label}
      control={control}
      type={showPassword ? 'text' : 'password'}
      startIcon={startIcon}
      endIcon={
        <IconButton edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      }
      onClickIcon={() => setShowPassword(!showPassword)}
      {...props}
    />
  );
};

export default PasswordField;
