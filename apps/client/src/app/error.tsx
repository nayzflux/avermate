// app/error.tsx
'use client';

import ErrorComponent from '../components/Error';

export default function GlobalErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <ErrorComponent
            errorMessage={error.message}
            errorStack={error.stack}
            reset={reset}
        />
    );
}
