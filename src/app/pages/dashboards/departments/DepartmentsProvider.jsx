// DepartmentsProvider.jsx
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  GET_ORGANIZATIONS_UNITS_URL,
  GET_DEPARTMENTS_URL,
  CREATE_ORGANIZATION_URL,
  UPDATE_ORGANIZATION_URL,
  DELETE_ORGANIZATION_URL,
  CREATE_DEPARTMENT_URL,
  UPDATE_DEPARTMENT_URL,
  DELETE_DEPARTMENT_URL,
} from "../../../../constants/api.urls.js";
import { DepartmentsContextProvider } from "./Departments.context.js";

const initialState = {
  organizations: [],
  departments: [],
  loading: false,
  error: null,
};

const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_DATA: "SET_DATA",
  CREATE_ORG: "CREATE_ORG",
  UPDATE_ORG: "UPDATE_ORG",
  DELETE_ORG: "DELETE_ORG",
  CREATE_DEPT: "CREATE_DEPT",
  UPDATE_DEPT: "UPDATE_DEPT",
  DELETE_DEPT: "DELETE_DEPT",
  SET_ERROR: "SET_ERROR",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_DATA:
      return { ...state, ...action.payload, loading: false };
    case ACTIONS.CREATE_ORG:
      return { ...state, organizations: [action.payload, ...state.organizations] };
    case ACTIONS.UPDATE_ORG:
      return {
        ...state,
        organizations: state.organizations.map((o) =>
            o.id === action.payload.id ? action.payload : o
        ),
      };
    case ACTIONS.DELETE_ORG:
      return {
        ...state,
        organizations: state.organizations.filter((o) => o.id !== action.payload),
      };
    case ACTIONS.CREATE_DEPT:
      return { ...state, departments: [action.payload, ...state.departments] };
    case ACTIONS.UPDATE_DEPT:
      return {
        ...state,
        departments: state.departments.map((d) =>
            d.id === action.payload.id ? action.payload : d
        ),
      };
    case ACTIONS.DELETE_DEPT:
      return {
        ...state,
        departments: state.departments.filter((d) => d.id !== action.payload),
      };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export function DepartmentsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { organizations, departments, loading, error } = state;

  // Загрузка данных
  const loadData = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const [orgRes, depRes] = await Promise.all([
        axios.get(GET_ORGANIZATIONS_UNITS_URL),
        axios.get(GET_DEPARTMENTS_URL),
      ]);
      dispatch({
        type: ACTIONS.SET_DATA,
        payload: {
          organizations: orgRes.data.data,
          departments: depRes.data.data,
        },
      });
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      toast.error("Ошибка загрузки данных");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // CRUD Организации
  const createOrganization = useCallback(async (data) => {
    try {
      const res = await axios.post(CREATE_ORGANIZATION_URL, data);
      dispatch({ type: ACTIONS.CREATE_ORG, payload: res.data.data });
      toast.success("Организация создана");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Ошибка создания");
      throw err;
    }
  }, []);

  const updateOrganization = useCallback(async (id, data) => {
    try {
      const res = await axios.put(UPDATE_ORGANIZATION_URL.replace(":id", id), data);
      dispatch({ type: ACTIONS.UPDATE_ORG, payload: res.data.data });
      toast.success("Организация обновлена");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Ошибка обновления");
      throw err;
    }
  }, []);

  const deleteOrganization = useCallback(async (id) => {
    try {
      await axios.delete(DELETE_ORGANIZATION_URL.replace(":id", id));
      dispatch({ type: ACTIONS.DELETE_ORG, payload: id });
      toast.success("Организация удалена");
    } catch (err) {
      toast.error(err.response?.data?.message || "Нельзя удалить: есть дочерние элементы");
    }
  }, []);

  // CRUD Департаменты
  const createDepartment = useCallback(async (data) => {
    try {
      const res = await axios.post(CREATE_DEPARTMENT_URL, data);
      dispatch({ type: ACTIONS.CREATE_DEPT, payload: res.data.data });
      toast.success("Департамент создан");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Ошибка создания");
      throw err;
    }
  }, []);

  const updateDepartment = useCallback(async (id, data) => {
    try {
      const res = await axios.put(UPDATE_DEPARTMENT_URL.replace(":id", id), data);
      dispatch({ type: ACTIONS.UPDATE_DEPT, payload: res.data.data });
      toast.success("Департамент обновлён");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Ошибка обновления");
      throw err;
    }
  }, []);

  const deleteDepartment = useCallback(async (id) => {
    try {
      await axios.delete(DELETE_DEPARTMENT_URL.replace(":id", id));
      dispatch({ type: ACTIONS.DELETE_DEPT, payload: id });
      toast.success("Департамент удалён");
    } catch (err) {
      toast.error(err.response?.data?.message || "Нельзя удалить: есть дочерние элементы");
    }
  }, []);

  const value = useMemo(
      () => ({
        organizations,
        departments,
        loading,
        error,
        createOrganization,
        updateOrganization,
        deleteOrganization,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        refetch: loadData,
      }),
      [
        organizations,
        departments,
        loading,
        error,
        createOrganization,
        updateOrganization,
        deleteOrganization,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        loadData,
      ]
  );

  return <DepartmentsContextProvider value={value}>{children}</DepartmentsContextProvider>;
}
