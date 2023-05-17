import { Button } from 'react-admin';

export const BulkRequestButton = ({ label, mutate, isLoading, icon }) => {
    return (
        <Button label={label} onClick={() => mutate()} disabled={isLoading}>
            {isLoading ? loader : icon}
        </Button>
    )
}
