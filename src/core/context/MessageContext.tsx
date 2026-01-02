import React, { createContext, useContext, useState } from 'react';
import { IMessageBarStyles, MessageBar, MessageBarType, Stack } from '@fluentui/react';

type MessageType = 'success' | 'error' | 'info' | 'warning';

interface IMessageContext {
    message: string | null;
    type: MessageType | null;
    setMessage: (message: string, type: MessageType) => void;
    clearMessage: () => void;
}

const MessageContext = createContext<IMessageContext | undefined>(undefined);

export enum MessageTypes {
    Success = 'success',
    Error = 'error',
    Info = 'info',
    Warning = 'warning'
}

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessageState] = useState<string | null>(null);
    const [type, setType] = useState<MessageType | null>(null);

    const setMessage = (message: string, type: MessageType) => {
        setMessageState(message);
        setType(type);

        setTimeout(() => {
            clearMessage();
        }, 5000);
    };

    const clearMessage = () => {
        setMessageState(null);
        setType(null);
    };

    const getMessageBarType = (type: MessageType | null): MessageBarType => {
        switch (type) {
            case 'success':
                return MessageBarType.success;
            case 'error':
                return MessageBarType.error;
            case 'info':
                return MessageBarType.info;
            case 'warning':
                return MessageBarType.warning;
            default:
                return MessageBarType.info;
        }
    };

    const messageBarStyles: Partial<IMessageBarStyles> = {
        root: {
            padding: '8px 16px',
            fontSize: '16px',
            height: 'auto',
        },
    };

    return (
        <MessageContext.Provider value={{ message, type, setMessage, clearMessage }}>
            <div style={{ position: 'relative', height: '100%' }}>
                {message && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            zIndex: 1000,
                        }}
                    >
                        <MessageBar
                            messageBarType={getMessageBarType(type)}
                            onDismiss={clearMessage}
                            isMultiline={false}
                            dismissButtonAriaLabel="Cerrar"
                            styles={messageBarStyles}
                        >
                            {message}
                        </MessageBar>
                    </div>
                )}
                {children}
            </div>
        </MessageContext.Provider>
    );
};

export const useMessage = (): IMessageContext => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};