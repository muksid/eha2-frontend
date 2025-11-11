// Local Imports
import { createSafeContext } from 'utils/createSafeContext';

export const [DepartmentsContextProvider, useDepartmentsContext] = createSafeContext(
    "useDepartmentsContext must be used within DepartmentsProvider"
);
