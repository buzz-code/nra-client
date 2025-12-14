import { useState, cloneElement, isValidElement, createContext, useContext } from 'react';
import { Button } from 'react-admin';
import { Dialog, DialogTitle } from '@mui/material';

const DialogContext = createContext({ onClose: () => { } });

export const useCommonDialog = () => useContext(DialogContext);

export const ActionOrDialogButton = ({
    dialogContent,
    title,
    dialogProps,
    onClose,
    onOpen,
    onClick,
    ...props // Button props
}) => {
    const [open, setOpen] = useState(false);

    const handleClick = (e) => {
        if (dialogContent) {
            e.stopPropagation();
            if (onOpen) onOpen(e);
            setOpen(true);
        } else {
            if (onClick) onClick(e);
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    };

    return (
        <>
            <Button onClick={handleClick} {...props} />
            {dialogContent && (
                <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    maxWidth="md"
                    {...dialogProps}
                    onClick={e => e.stopPropagation()}
                >
                    {title && <DialogTitle>{title}</DialogTitle>}
                    <DialogContext.Provider value={{ onClose: handleClose }}>
                        {typeof dialogContent === 'function'
                            ? dialogContent({ onClose: handleClose })
                            : (isValidElement(dialogContent) && typeof dialogContent.type !== 'string')
                                ? cloneElement(dialogContent, { onClose: handleClose })
                                : dialogContent
                        }
                    </DialogContext.Provider>
                </Dialog>
            )}
        </>
    );
};
