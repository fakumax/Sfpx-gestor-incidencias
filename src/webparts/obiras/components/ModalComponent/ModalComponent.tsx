import { FontWeights, IButtonStyles, IIconProps, IconButton, Modal, getTheme, mergeStyleSets } from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import * as React from 'react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

interface IModalComponentProps {
    title: string;
    isOpen: boolean;
    onDismiss: () => void;
    children: React.ReactNode;
}

const ModalComponent: React.FC<IModalComponentProps> = ({ title, isOpen, onDismiss, children }) => {
    const cancelIcon: IIconProps = { iconName: 'Cancel' };
    const titleId = useId('title');
    const theme = getTheme();

    const contentStyles = mergeStyleSets({
        container: {
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'stretch',
            width: '600px',
        },
        header: [
            theme.fonts.xLargePlus,
            {
                flex: '1 1 auto',
                borderTop: `4px solid ${theme.palette.themePrimary}`,
                color: theme.palette.neutralPrimary,
                display: 'flex',
                alignItems: 'center',
                fontWeight: FontWeights.semibold,
                padding: '12px 12px 14px 24px',
                fontSize: theme.fonts.large.fontSize,
            },
        ],
        heading: {
            color: theme.palette.neutralPrimary,
            fontWeight: FontWeights.semibold,
            fontSize: 'inherit',
            margin: '0',
        },
        body: {
            flex: '4 4 auto',
            padding: '0 24px 24px 24px',
            overflowY: 'hidden',
            selectors: {
                p: { margin: '14px 0' },
                'p:first-child': { marginTop: 0 },
                'p:last-child': { marginBottom: 0 },
            },
        },
    });

    const iconButtonStyles: Partial<IButtonStyles> = {
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: 'auto',
            marginTop: '4px',
        },
    };

    return (
        <Modal
            titleAriaId={titleId}
            isOpen={isOpen}
            onDismiss={onDismiss}
            isBlocking={false}
            containerClassName={contentStyles.container}
        >
            <div className={contentStyles.header}>
                <h2 className={contentStyles.heading} id={titleId}>
                    {title}
                </h2>
                <IconButton
                    styles={iconButtonStyles}
                    iconProps={cancelIcon}
                    onClick={onDismiss}
                />
            </div>
            <div className={contentStyles.body}>
                {children}
            </div>


        </Modal>
    );
};


export default ModalComponent;