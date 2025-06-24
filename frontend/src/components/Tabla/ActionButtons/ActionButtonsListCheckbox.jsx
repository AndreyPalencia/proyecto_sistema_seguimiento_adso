import { memo, useEffect, useMemo, useState } from 'react';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';
import { useAuth } from '../../../context/AuthContext';
import { Checkbox, IconButton, Tooltip, Box, alpha } from '@mui/material';

const ActionsButtonsListBox = memo(
  ({
    idSelecionado,
    inicialValues,
    extraActions = [],
    rowActions = () => [],
    rowData = null,
  }) => {
    const { actionsButtons: globalActions } = useActionsButtonsContext();

    const { roleUsuario } = useAuth();

    const getExtraActionsByRole = () => {
      return extraActions[roleUsuario] || [];
    };

    const getRowActionsByData = () => {
      return rowActions?.(rowData) || [];
    };

    const combinedActions = useMemo(() => {
      return [
        ...globalActions,
        ...getExtraActionsByRole(),
        ...getRowActionsByData(),
      ];
    }, [globalActions, roleUsuario, rowData, extraActions, rowActions]);

    const [checkboxState, setCheckboxState] = useState({});

    //console.log(inicialValues, 'valores inciarles')

    // Al montar, setear los valores iniciales solo para los checkboxes
    useEffect(() => {
      if (!inicialValues) return;
      const initial = {};
      combinedActions.forEach((btn) => {
        if (btn.type === 'checkbox') {
          initial[btn.id] = inicialValues?.[btn.id] ?? false;
        }
      });

      setCheckboxState((prev) => {
        const isEqual =
          Object.keys(initial).length === Object.keys(prev).length &&
          Object.keys(initial).every((key) => initial[key] === prev[key]);

        return isEqual ? prev : initial;
      });
    }, [combinedActions, inicialValues]);

    const handleCheckboxChange = (buttonId, checked) => {
      setCheckboxState((prev) => ({
        ...prev,
        [buttonId]: checked,
      }));

      const button = combinedActions.find((b) => b.id === buttonId);
      //console.log(button, 'acciont ')
      if (button?.action) {
        //console.log(checked, idSelecionado, 'value antes')
        button.action(checked, idSelecionado); // ✅ checked es el nuevo estado
      }
    };

    if (!Array.isArray(combinedActions) || combinedActions.length === 0)
      return null;

    return (
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
        {combinedActions.map((button, index) => {
          if (button.type === 'checkbox') {
            return (
              <Tooltip
                key={`checkbox-${button.id}`}
                title={
                  checkboxState[button.id]
                    ? button.tooltip
                    : button.otherTooltip || ''
                }
                disableInteractive={false} // Asegura que el tooltip se muestre siempre
              >
                <div
                  style={{
                    display: 'inline-block', // Asegura que el tooltip se alinee con el checkbox
                  }}
                >
                  <Checkbox
                    checked={checkboxState[button.id] || false}
                    disabled={button.isDisabled}
                    onChange={(e) =>
                      handleCheckboxChange(button.id, e.target.checked)
                    }
                    icon={button.iconCheck ? <button.iconCheck /> : undefined}
                    checkedIcon={
                      button.checkedIcon ? <button.checkedIcon /> : undefined
                    }
                    sx={{
                      color: button.color || 'inherit',
                      '&.Mui-disabled': {
                        color: alpha(button.color || '#000', 0.9),
                      },
                    }}
                    slotProps={{
                      input: {
                        'aria-label': button.tooltip,
                      },
                    }}
                  />
                </div>
              </Tooltip>
            );
          }

          if (button.icon && button.action) {
            const Icon = button.icon;
            return (
              <Tooltip key={`button-${index}`} title={button.tooltip || ''}>
                <IconButton
                  onClick={() => button.action(idSelecionado)}
                  sx={{
                    color: button.color || 'inherit',
                    position: 'relative',
                    left: button.position === 'left' ? 0 : 'auto',
                    right: button.position === 'right' ? 0 : 'auto',
                  }}
                >
                  <Icon />
                </IconButton>
              </Tooltip>
            );
          }

          return null;
        })}
      </Box>
    );
  }
);

export default ActionsButtonsListBox;
