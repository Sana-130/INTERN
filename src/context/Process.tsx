import React, { createContext, useContext, useState } from 'react';

interface Repo {
    id:number | null;
    name: string | null;
    branch:string | null;
    checked: Record<string, boolean>;
}

interface RepoContextType {
    repo: Repo | null;
    setRepo: React.Dispatch<React.SetStateAction<Repo | null>>;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [repo, setRepo] = useState<Repo | null>(null);

    return (
        <RepoContext.Provider value={{ repo, setRepo }}>
            {children}
        </RepoContext.Provider>
    );
};

export const useRepo = (): RepoContextType => {
    const context = useContext(RepoContext);
    if (context === undefined) {
        throw new Error('useRepo must be used within a RepoProvider');
    }
    return context;
};
